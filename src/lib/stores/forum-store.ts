// Forum store kaldırıldı — tüm veri API üzerinden forum.service.ts ile çekiliyor.
// GET /forum/questions  — public liste
// GET /forum/questions/:id  — soru detayı
// POST /forum/questions  — @Roles('DANISAN')
// POST /forum/questions/:id/answers  — @Roles('UZMAN')
export {};
