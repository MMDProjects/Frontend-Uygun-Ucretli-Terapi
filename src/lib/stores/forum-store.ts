"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ForumThread = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags: string[];
  createdAt: string;
  replyCount: number;
  lastActivityAt: string;
};

export type ForumReply = {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: "danisan" | "uzman";
  content: string;
  createdAt: string;
};

const SEED_THREADS: ForumThread[] = [
  {
    id: "s1",
    title: "Sosyal kaygı ile nasıl başa çıkabilirim?",
    content:
      "Merhaba, son birkaç aydır sosyal ortamlarda çok fazla kaygı yaşıyorum. Toplantılarda konuşmak, yeni insanlarla tanışmak beni çok geriyor. Bu durumla başa çıkmak için neler yapabilirim?",
    authorId: "seed-u1",
    authorName: "Selin K.",
    tags: ["Kaygı", "Sosyal Fobi"],
    createdAt: "2026-04-25T10:30:00",
    replyCount: 3,
    lastActivityAt: "2026-04-27T14:20:00",
  },
  {
    id: "s2",
    title: "Uyku sorunum için ne önerirsiniz?",
    content:
      "Yaklaşık 3 aydır uyku sorunum var. Geceleri saatlerce yatakta dönüp duruyorum, zinim sürekli düşüncelerle meşgul. Bu durumun psikolojik bir sebebi olabilir mi?",
    authorId: "seed-u2",
    authorName: "Mert A.",
    tags: ["Uyku", "Stres"],
    createdAt: "2026-04-24T09:15:00",
    replyCount: 2,
    lastActivityAt: "2026-04-26T11:45:00",
  },
  {
    id: "s3",
    title: "İş stresi ve tükenmişlik hissediyorum",
    content:
      "İki yıldır yoğun tempoda çalışıyorum ve artık her şeyden nefret eder hale geldim. Sabah işe gitmek istemiyorum, hiçbir şeyden zevk almıyorum. Bu tükenmişlik mi yoksa başka bir şey mi?",
    authorId: "seed-u3",
    authorName: "Ayşe T.",
    tags: ["Tükenmişlik", "İş Stresi"],
    createdAt: "2026-04-23T16:00:00",
    replyCount: 4,
    lastActivityAt: "2026-04-28T09:10:00",
  },
  {
    id: "s4",
    title: "Panik atak geçiriyorum, ne yapmalıyım?",
    content:
      "Geçen hafta ilk kez panik atak geçirdim. Kalp çarpıntısı, nefes darlığı, ölüm korkusu hissettim. Doktora gittim, fiziksel bir sorun yok. Panik atak için nasıl bir yol izlemeliyim?",
    authorId: "seed-u4",
    authorName: "Can Y.",
    tags: ["Panik Atak", "Anksiyete"],
    createdAt: "2026-04-22T11:20:00",
    replyCount: 5,
    lastActivityAt: "2026-04-27T17:30:00",
  },
  {
    id: "s5",
    title: "Depresyon mu yaşıyorum nasıl anlayabilirim?",
    content:
      "Sürekli yorgun hissediyorum, eskiden sevdiğim şeylerden artık zevk almıyorum. Motivasyonum çok düştü. Bu depresyon belirtisi midir, bir uzmana gitmeliyim miyim?",
    authorId: "seed-u5",
    authorName: "Elif S.",
    tags: ["Depresyon", "Motivasyon"],
    createdAt: "2026-04-21T13:45:00",
    replyCount: 3,
    lastActivityAt: "2026-04-25T10:00:00",
  },
];

const SEED_REPLIES: ForumReply[] = [
  { id: "sr1", threadId: "s1", authorId: "se1", authorName: "Uzm. Psk. Ayşe Demir", authorRole: "uzman", content: "Merhaba Selin Hanım. Sosyal kaygı çok yaygın ve tedavisi mümkün. BDT (Bilişsel Davranışçı Terapi) en etkili yöntemlerden biri. Kaygı tetikleyicilerinizi belirleyip kademeli maruz kalma egzersizleri yapmanızı öneririm. 4-7-8 nefes tekniği de anlık kaygıyı azaltır.", createdAt: "2026-04-25T12:00:00" },
  { id: "sr2", threadId: "s1", authorId: "seed-u1", authorName: "Selin K.", authorRole: "danisan", content: "Teşekkürler, BDT için bir uzmana başvurmalı mıyım yoksa online kaynaklar yeterli olur mu?", createdAt: "2026-04-25T13:30:00" },
  { id: "sr3", threadId: "s1", authorId: "se2", authorName: "Klinik Psk. Elif Arslan", authorRole: "uzman", content: "Düşünce günlüğü tutmak da çok faydalı. Kaygı yaratan durumu, o andaki düşünceyi ve alternatif bakış açısını not edin. Bir uzmanla çalışmak ise süreci hızlandırır.", createdAt: "2026-04-26T09:00:00" },
  { id: "sr4", threadId: "s2", authorId: "se3", authorName: "Psk. Danışman Berk Yıldız", authorRole: "uzman", content: "Uyku sorunları çoğunlukla anksiyete veya stresle bağlantılıdır. Yatmadan 1 saat önce ekran kullanımını kesmek, 'endişe defteri' tutmak ve düzenli uyku ritüeli oluşturmak işe yarar.", createdAt: "2026-04-24T15:00:00" },
  { id: "sr5", threadId: "s2", authorId: "seed-u2", authorName: "Mert A.", authorRole: "danisan", content: "Endişe defteri fikri ilginç, deneyeceğim. Peki bu durum uzun sürerse ne olur?", createdAt: "2026-04-25T10:30:00" },
  { id: "sr6", threadId: "s3", authorId: "se1", authorName: "Uzm. Psk. Ayşe Demir", authorRole: "uzman", content: "Tarif ettiğiniz belirtiler tükenmişlik sendromunu düşündürüyor. Duygusal tükenme, duyarsızlaşma ve başarı hissinde düşüş olarak kendini gösterir. Sınır koymayı öğrenmek çok önemli.", createdAt: "2026-04-23T17:30:00" },
  { id: "sr7", threadId: "s3", authorId: "se2", authorName: "Klinik Psk. Elif Arslan", authorRole: "uzman", content: "Gün içinde 5-10 dakikalık mikro molalar, haftada en az bir gün tamamen iş dışı geçirmek ve sizin için anlam ifade eden küçük aktiviteler bulmak iyi gelir.", createdAt: "2026-04-24T11:00:00" },
  { id: "sr8", threadId: "s3", authorId: "seed-u3", authorName: "Ayşe T.", authorRole: "danisan", content: "Sınır koymayı hiç beceremiyorum, bu konuda nasıl çalışabilirim?", createdAt: "2026-04-25T14:00:00" },
  { id: "sr9", threadId: "s3", authorId: "se3", authorName: "Psk. Danışman Berk Yıldız", authorRole: "uzman", content: "'Ben dili' ile başlayın: 'Yapamam' yerine 'Bu hafta kapasitem doldu.' Küçük sınırlardan başlayın.", createdAt: "2026-04-26T09:30:00" },
  { id: "sr10", threadId: "s4", authorId: "se1", authorName: "Uzm. Psk. Ayşe Demir", authorRole: "uzman", content: "Panik ataklar korkulduğu kadar tehlikeli değil ama çok zorlayıcı. Ataklar sırasında 'bu geçecek' diye kendinize hatırlatın, diyafram nefesi yapın. Bir uzmanla görüşmenizi şiddetle öneririm.", createdAt: "2026-04-22T14:00:00" },
];

type ForumState = {
  threads: ForumThread[];
  replies: ForumReply[];
  addThread: (title: string, content: string, tags: string[], authorId: string, authorName: string) => string;
  addReply: (threadId: string, content: string, authorId: string, authorName: string, authorRole: "danisan" | "uzman") => void;
};

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      threads: SEED_THREADS,
      replies: SEED_REPLIES,

      addThread: (title, content, tags, authorId, authorName) => {
        const id = `t-${Date.now()}`;
        const now = new Date().toISOString();
        set((s) => ({
          threads: [
            { id, title, content, authorId, authorName, tags, createdAt: now, replyCount: 0, lastActivityAt: now },
            ...s.threads,
          ],
        }));
        return id;
      },

      addReply: (threadId, content, authorId, authorName, authorRole) => {
        const id = `r-${Date.now()}`;
        const now = new Date().toISOString();
        set((s) => ({
          replies: [...s.replies, { id, threadId, authorId, authorName, authorRole, content, createdAt: now }],
          threads: s.threads.map((t) =>
            t.id === threadId ? { ...t, replyCount: t.replyCount + 1, lastActivityAt: now } : t
          ),
        }));
      },
    }),
    {
      name: "psk-forum-store",
      partialize: (s) => ({
        threads: s.threads.filter((t) => t.id.startsWith("t-")),
        replies: s.replies.filter((r) => r.id.startsWith("r-")),
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<ForumState>;
        return {
          ...current,
          threads: [...SEED_THREADS, ...(p.threads ?? [])],
          replies: [...SEED_REPLIES, ...(p.replies ?? [])],
        };
      },
    }
  )
);
