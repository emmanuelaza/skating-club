import 'server-only';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityFetch } from './client';
import { getCurrentTenant } from '@/lib/tenant';
import { createAdminClient } from '@/lib/supabase/admin';
import type { MembershipPlan } from '@/types';

// --- Tipos de documentos Sanity ---------------------------------------------

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export interface SiteConfig {
  name?: string;
  tagline?: string;
  description?: string;
  logo?: SanityImageSource;
  social?: SocialLinks;
  contact?: { email?: string; phone?: string; address?: string };
}

export interface ClassTypeDoc {
  _id: string;
  name: string;
  description?: string;
  level?: string;
  image?: SanityImageSource;
  color?: string;
  durationMinutes?: number;
}

export interface TeamMemberDoc {
  _id: string;
  name: string;
  photo?: SanityImageSource;
  bio?: string;
  specialty?: string;
}

export interface TestimonialDoc {
  _id: string;
  name: string;
  photo?: SanityImageSource;
  text?: string;
  plan?: string;
  rating?: number;
}

export interface FAQDoc {
  _id: string;
  question: string;
  answer?: string;
  category?: string;
}

export interface PageDoc {
  _id: string;
  title: string;
  excerpt?: string;
  body?: unknown;
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  author?: string;
  mainImage?: SanityImageSource;
  excerpt?: string;
  publishedAt?: string;
}

export interface PostDoc extends PostListItem {
  body?: unknown;
}

// --- GROQ --------------------------------------------------------------------

const SITE_CONFIG_QUERY = `*[_type == "siteConfig"][0]{name,tagline,description,logo,social,contact}`;
const ALL_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc)[0...$limit]{
  _id, title, "slug": slug.current, category, author, mainImage, excerpt, publishedAt
}`;
const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, category, author, mainImage, excerpt, publishedAt, body
}`;
const CLASS_TYPES_QUERY = `*[_type == "classType"] | order(order asc){
  _id, name, description, level, image, color, durationMinutes
}`;
const TEAM_QUERY = `*[_type == "teamMember"] | order(order asc){_id, name, photo, bio, specialty}`;
const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(order asc){_id, name, photo, text, plan, rating}`;
const FAQS_QUERY = `*[_type == "faq"] | order(order asc){_id, question, answer, category}`;
const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{_id, title, excerpt, body}`;

// --- Funciones ---------------------------------------------------------------

export function getSiteConfig(): Promise<SiteConfig | null> {
  return sanityFetch<SiteConfig>({ query: SITE_CONFIG_QUERY, tags: ['siteConfig'] });
}

export async function getAllPosts(limit = 50): Promise<PostListItem[]> {
  return (await sanityFetch<PostListItem[]>({ query: ALL_POSTS_QUERY, params: { limit } })) ?? [];
}

export function getPostBySlug(slug: string): Promise<PostDoc | null> {
  return sanityFetch<PostDoc>({ query: POST_BY_SLUG_QUERY, params: { slug } });
}

export async function getAllClassTypes(): Promise<ClassTypeDoc[]> {
  return (await sanityFetch<ClassTypeDoc[]>({ query: CLASS_TYPES_QUERY })) ?? [];
}

export async function getAllTeamMembers(): Promise<TeamMemberDoc[]> {
  return (await sanityFetch<TeamMemberDoc[]>({ query: TEAM_QUERY })) ?? [];
}

export async function getAllTestimonials(): Promise<TestimonialDoc[]> {
  return (await sanityFetch<TestimonialDoc[]>({ query: TESTIMONIALS_QUERY })) ?? [];
}

export async function getAllFAQs(): Promise<FAQDoc[]> {
  return (await sanityFetch<FAQDoc[]>({ query: FAQS_QUERY })) ?? [];
}

export function getPageBySlug(slug: string): Promise<PageDoc | null> {
  return sanityFetch<PageDoc>({ query: PAGE_BY_SLUG_QUERY, params: { slug } });
}

/**
 * Planes de membresía — desde Supabase (no Sanity). Usa el cliente admin porque
 * el sitio público no tiene sesión; filtra por la sede del subdominio actual.
 */
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  const tenant = await getCurrentTenant();
  if (!tenant) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('is_active', true)
    .order('price_cop', { ascending: true });
  return data ?? [];
}
