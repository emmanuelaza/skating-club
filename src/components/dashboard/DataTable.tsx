import Link from 'next/link';
import type { Route } from 'next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { RowLink } from './RowLink';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  getRowHref?: (row: T) => string;
  emptyMessage?: string;
}

/**
 * Tabla genérica server-side. Las filas se reciben ya cargadas; si se pasa
 * `getRowHref` cada fila navega a su detalle (vía RowLink cliente).
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  getRowHref,
  emptyMessage = 'Sin resultados.',
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.headClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const cells = columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ));
              const href = getRowHref?.(row);
              return href ? (
                <RowLink key={getRowId(row)} href={href}>
                  {cells}
                </RowLink>
              ) : (
                <TableRow key={getRowId(row)}>{cells}</TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/** Esqueleto de carga con el mismo layout de la tabla. */
export function DataTableSkeleton({ columns, rows = 8 }: { columns: number; rows?: number }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-4 border-b border-border px-4 py-3">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 border-b border-border px-4 py-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface PaginationProps {
  page: number;
  pageCount: number;
  /** Construye el href de una página dada (preserva otros search params). */
  hrefForPage: (page: number) => string;
}

/** Paginación basada en links (navegación server-side). */
export function Pagination({ page, pageCount, hrefForPage }: PaginationProps) {
  if (pageCount <= 1) return null;
  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  const linkClass = 'inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm';

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Página {page} de {pageCount}
      </p>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link href={hrefForPage(page - 1) as Route} className={cn(linkClass, 'hover:bg-secondary')}>
            <ChevronLeft className="size-4" aria-hidden />
            Anterior
          </Link>
        ) : (
          <span className={cn(linkClass, 'cursor-not-allowed text-muted-foreground opacity-50')}>
            <ChevronLeft className="size-4" aria-hidden />
            Anterior
          </span>
        )}
        {hasNext ? (
          <Link href={hrefForPage(page + 1) as Route} className={cn(linkClass, 'hover:bg-secondary')}>
            Siguiente
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span className={cn(linkClass, 'cursor-not-allowed text-muted-foreground opacity-50')}>
            Siguiente
            <ChevronRight className="size-4" aria-hidden />
          </span>
        )}
      </div>
    </div>
  );
}
