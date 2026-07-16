import { Suspense } from 'react';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable, DataTableSkeleton, Pagination, type Column } from '@/components/dashboard/DataTable';
import { MembersFilters } from '@/components/dashboard/members/MembersFilters';
import { NewMemberSheet } from '@/components/dashboard/members/NewMemberSheet';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import type { SubscriptionStatus } from '@/types/database';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

type BadgeVariant = 'success' | 'warning' | 'destructive';

interface MemberRow {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface MembersTableProps {
  search: string;
  status: string;
  page: number;
}

async function MembersTable({ search, status, page }: MembersTableProps) {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Restricción por estado de suscripción (activos / vencidos).
  let restrictIds: string[] | null = null;
  if (status === 'activos' || status === 'vencidos') {
    const statuses: SubscriptionStatus[] =
      status === 'activos' ? ['active'] : ['past_due', 'canceled', 'paused', 'pending'];
    const { data: subs, error } = await supabase
      .from('subscriptions')
      .select('profile_id')
      .in('status', statuses);
    if (error) throw new Error(error.message);
    restrictIds = Array.from(new Set((subs ?? []).map((sub) => sub.profile_id)));
    if (restrictIds.length === 0) restrictIds = ['00000000-0000-0000-0000-000000000000'];
  }

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url, is_active, created_at', { count: 'exact' });

  if (search) {
    const safe = search.replace(/[%,()]/g, ' ').trim();
    if (safe) query = query.or(`full_name.ilike.%${safe}%,email.ilike.%${safe}%`);
  }
  if (status === 'suspendidos') query = query.eq('is_active', false);
  if (restrictIds) query = query.in('id', restrictIds);

  const {
    data: members,
    count,
    error,
  } = await query.order('created_at', { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);

  const rows = (members ?? []) as MemberRow[];
  const ids = rows.map((row) => row.id);

  const planByProfile = new Map<string, string>();
  const activeProfiles = new Set<string>();
  if (ids.length > 0) {
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('profile_id, plan_id')
      .in('profile_id', ids)
      .eq('status', 'active');
    const planIds = Array.from(new Set((subs ?? []).map((sub) => sub.plan_id)));
    const planNames = new Map<string, string>();
    if (planIds.length > 0) {
      const { data: plans } = await supabase
        .from('membership_plans')
        .select('id, name')
        .in('id', planIds);
      for (const plan of plans ?? []) planNames.set(plan.id, plan.name);
    }
    for (const sub of subs ?? []) {
      activeProfiles.add(sub.profile_id);
      const name = planNames.get(sub.plan_id);
      if (name) planByProfile.set(sub.profile_id, name);
    }
  }

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const columns: Column<MemberRow>[] = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (member) => (
        <div className="flex items-center gap-3">
          <Avatar name={member.full_name ?? member.email} src={member.avatar_url} />
          <span className="font-medium text-foreground">{member.full_name ?? '—'}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      cell: (member) => <span className="text-muted-foreground">{member.email}</span>,
    },
    {
      key: 'plan',
      header: 'Plan activo',
      cell: (member) =>
        planByProfile.get(member.id) ? (
          <span className="text-foreground">{planByProfile.get(member.id)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (member) => {
        const variant: BadgeVariant = !member.is_active
          ? 'destructive'
          : activeProfiles.has(member.id)
            ? 'success'
            : 'warning';
        const label = !member.is_active
          ? 'Suspendido'
          : activeProfiles.has(member.id)
            ? 'Activo'
            : 'Sin plan';
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'created',
      header: 'Registro',
      cell: (member) => <span className="text-muted-foreground">{formatDate(member.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Acciones',
      headClassName: 'text-right',
      className: 'text-right',
      cell: () => <ChevronRight className="ml-auto size-4 text-muted-foreground" aria-hidden />,
    },
  ];

  const hrefForPage = (target: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status && status !== 'todos') params.set('status', status);
    if (target > 1) params.set('page', String(target));
    const qs = params.toString();
    return `/dashboard/members${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(member) => member.id}
        getRowHref={(member) => `/dashboard/members/${member.id}`}
        emptyMessage="No se encontraron miembros."
      />
      <Pagination page={page} pageCount={pageCount} hrefForPage={hrefForPage} />
    </div>
  );
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? '';
  const status = params.status ?? 'todos';
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);

  return (
    <div className="space-y-6">
      <PageHeader title="Miembros" description="Gestiona los miembros de tu sede.">
        <NewMemberSheet />
      </PageHeader>

      <MembersFilters />

      <Suspense key={`${search}-${status}-${page}`} fallback={<DataTableSkeleton columns={6} />}>
        <MembersTable search={search} status={status} page={page} />
      </Suspense>
    </div>
  );
}
