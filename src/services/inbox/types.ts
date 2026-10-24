export type Channel = "WHATSAPP" | "INSTAGRAM" | "WEB";
export type ConversationStatus = "OPEN" | "PENDING_AGENT" | "CLOSED";
export type SenderType = "CLIENT" | "BOT" | "AGENT";
export type LeadStatus =
  | "YENI"
  | "ARANDI"
  | "ULASILAMADI"
  | "RANDEVU_OLUSTURULDU"
  | "VAZGECTI";
export type KnowledgeCategory = "FIYAT" | "HIZMET" | "PROSEDUR" | "SSS";
export type KnowledgeSource = "MANUAL" | "SSS" | "CONVERSATION";
export type ServiceType =
  | "BIREYSEL"
  | "CIFT"
  | "AILE"
  | "COCUK_ERGEN"
  | "EMDR"
  | "ON_GORUSME";
export type PaymentStatus = "PAID" | "PENDING" | "FREE";
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type UnansweredStatus = "OPEN" | "RESOLVED";

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ContactSummary {
  id: string;
  fullName: string | null;
  phone: string | null;
  instagramId: string | null;
}

export interface Contact extends ContactSummary {
  age: number | null;
  notes: string | null;
  channel: Channel;
  createdAt: string;
  lastActiveAt: string;
  userId: string | null;
}

export interface ConversationBase {
  id: string;
  contactId: string;
  channel: Channel;
  isBotActive: boolean;
  status: ConversationStatus;
  flaggedCrisis: boolean;
  createdAt: string;
  lastMessageAt: string;
}

export interface LastMessagePreview {
  content: string;
  senderType: SenderType;
  createdAt: string;
}

export interface ConversationListItem extends ConversationBase {
  contact: ContactSummary;
  lastMessage: LastMessagePreview | null;
}

export interface Lead {
  id: string;
  contactId: string;
  conversationId: string | null;
  channel: Channel;
  serviceType: ServiceType;
  fullName: string;
  age: number | null;
  phone: string | null;
  preferredCallTime: string;
  summary: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadListItem extends Lead {
  contact: ContactSummary;
}

export interface Appointment {
  id: string;
  contactId: string;
  therapistId: string;
  serviceType: ServiceType;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  roomToken: string;
  createdAt: string;
  updatedAt: string;
  therapist: {
    id: string;
    user: { firstName: string; lastName: string };
  };
}

export interface ConversationAppointment extends Omit<Appointment, "therapist"> {
  therapist: {
    title: string | null;
    user: { firstName: string; lastName: string };
  };
}

export interface ConversationDetail extends ConversationBase {
  contact: Contact;
  leads: Lead[];
  appointments: ConversationAppointment[];
  windowOpen: boolean;
}

export interface InboxMessage {
  id: string;
  conversationId: string;
  senderType: SenderType;
  content: string;
  metaMessageId: string | null;
  agentUserId: string | null;
  agentUser: { firstName: string; lastName: string } | null;
  createdAt: string;
}

export interface InboxCounts {
  open: number;
  pendingAgent: number;
  crisis: number;
  newLeads: number;
  openUnanswered: number;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  topScore: number | null;
  status: UnansweredStatus;
  createdAt: string;
  conversationId: string;
  contact: { id: string; fullName: string | null };
}

export interface UnansweredResolved {
  id: string;
  conversationId: string;
  question: string;
  topScore: number | null;
  status: UnansweredStatus;
  createdAt: string;
}

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  title: string;
  content: string;
  isActive: boolean;
  source: KnowledgeSource;
  sourceRefId: string | null;
  hasEmbedding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListConversationsParams {
  status?: ConversationStatus | "ALL";
  channel?: Channel;
  crisis?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ListMessagesParams {
  before?: string;
  limit?: number;
}

export interface UpdateContactInput {
  fullName?: string;
  age?: number;
  phone?: string;
  notes?: string;
}

export interface ListPagedParams {
  page?: number;
  limit?: number;
}

export interface ListLeadsParams extends ListPagedParams {
  status?: LeadStatus;
}

export interface ListUnansweredParams extends ListPagedParams {
  status?: UnansweredStatus;
}

export interface ListKnowledgeParams extends ListPagedParams {
  source?: KnowledgeSource;
  q?: string;
}

export interface CreateKnowledgeInput {
  category: KnowledgeCategory;
  title: string;
  content: string;
  piiConfirmed: boolean;
  source?: "MANUAL" | "CONVERSATION";
}

export interface UpdateKnowledgeInput {
  category?: KnowledgeCategory;
  title?: string;
  content?: string;
  isActive?: boolean;
}

export interface ResolveUnansweredInput {
  addToKnowledge: boolean;
  category?: KnowledgeCategory;
  title?: string;
  content?: string;
  piiConfirmed?: boolean;
}

export interface ListAppointmentsParams {
  contactId?: string;
  therapistId?: string;
  from?: string;
  to?: string;
}

export interface CreateAppointmentInput {
  contactId: string;
  therapistId: string;
  serviceType: ServiceType;
  scheduledAt: string;
  durationMinutes?: number;
  paymentStatus?: PaymentStatus;
  leadId?: string;
}

export interface InboxMessageCreatedEvent {
  conversationId: string;
  message: InboxMessage;
}

export interface InboxConversationUpdatedEvent {
  conversationId: string;
}
