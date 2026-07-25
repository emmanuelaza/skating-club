import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync('.env.local', 'utf8');
const vars = {};
env.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) vars[k.trim()] = v.join('=').trim();
});

const supabase = createClient(vars.NEXT_PUBLIC_SUPABASE_URL, vars.SUPABASE_SERVICE_ROLE_KEY);

const TABLES = [
  'tenants', 'profiles', 'membership_plans', 'subscriptions',
  'class_types', 'classes', 'bookings',
  'products', 'product_variants', 'orders', 'order_items',
  'loyalty_points', 'support_tickets', 'ticket_messages',
  'payment_events', 'announcements'
];

// Expected columns based on migration SQL (to probe)
const EXPECTED = {
  tenants: ['id','name','slug','logo_url','primary_color','is_active','created_at','updated_at'],
  profiles: ['id','auth_user_id','tenant_id','email','full_name','phone','role','avatar_url','document_id','date_of_birth','is_active','created_at','updated_at'],
  membership_plans: ['id','tenant_id','name','description','price_cop','currency','interval','features','treli_plan_id','is_active','created_at','updated_at'],
  subscriptions: ['id','tenant_id','profile_id','plan_id','status','treli_subscription_id','current_period_start','current_period_end','created_at','updated_at'],
  class_types: ['id','tenant_id','name','description','duration_minutes','color','created_at','updated_at'],
  classes: ['id','tenant_id','class_type_id','instructor_id','starts_at','ends_at','capacity','location','notes','created_at','updated_at'],
  bookings: ['id','tenant_id','profile_id','class_id','status','created_at','updated_at'],
  products: ['id','tenant_id','name','slug','description','price_cop','images','stock','is_active','created_at','updated_at'],
  product_variants: ['id','product_id','sku','name','stock','created_at','updated_at'],
  orders: ['id','tenant_id','profile_id','status','total_cop','reference','created_at','updated_at'],
  order_items: ['id','order_id','product_id','variant_id','quantity','unit_price_cop','created_at'],
  loyalty_points: ['id','tenant_id','profile_id','type','points','description','reference_id','created_at'],
  support_tickets: ['id','tenant_id','profile_id','subject','status','priority','assigned_to','created_at','updated_at'],
  ticket_messages: ['id','ticket_id','tenant_id','sender_id','body','is_internal','created_at'],
  payment_events: ['id','tenant_id','event_type','payload','processed','created_at'],
  announcements: ['id','tenant_id','title','body','audience','published','published_at','author_id','created_at','updated_at'],
};

for (const table of TABLES) {
  const cols = EXPECTED[table] || [];
  const results = {};
  for (const col of cols) {
    const { error } = await supabase.from(table).select(col).limit(1);
    results[col] = error ? `MISSING` : 'ok';
  }
  const missing = Object.entries(results).filter(([,v]) => v === 'MISSING').map(([k]) => k);
  const ok = Object.entries(results).filter(([,v]) => v === 'ok').map(([k]) => k);
  console.log(`\n=== ${table} ===`);
  console.log(`  OK:     ${ok.join(', ')}`);
  if (missing.length) console.log(`  MISSING: ${missing.join(', ')}`);
}
