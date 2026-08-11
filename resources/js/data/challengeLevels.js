// Trainer stages untuk mode Challenge (15 level), berdasarkan total base stat (BST) tim lawan.
// Tiap stage lawan adalah trainer dengan tim 3 Pokemon. Level 15 menghadirkan
// trainer boss dengan tim berisi Mewtwo/Arceus + legendaris kuat lain.
export const CHALLENGE_LEVELS = [
    { level: 1, label: 'Trainer Pemula', minBst: 0, maxBst: 250, color: '#94A3B8' },
    { level: 2, label: 'Trainer Baru', minBst: 250, maxBst: 300, color: '#A3A3A3' },
    { level: 3, label: 'Trainer Berpengalaman', minBst: 300, maxBst: 350, color: '#4ADE80' },
    { level: 4, label: 'Trainer Ahli', minBst: 350, maxBst: 400, color: '#34D399' },
    { level: 5, label: 'Gym Leader Muda', minBst: 400, maxBst: 440, color: '#60A5FA' },
    { level: 6, label: 'Gym Leader', minBst: 440, maxBst: 480, color: '#3B82F6' },
    { level: 7, label: 'Gym Leader Senior', minBst: 480, maxBst: 510, color: '#818CF8' },
    { level: 8, label: 'Elite Four Junior', minBst: 510, maxBst: 540, color: '#A78BFA' },
    { level: 9, label: 'Elite Four', minBst: 540, maxBst: 570, color: '#C084FC' },
    { level: 10, label: 'Elite Four Senior', minBst: 570, maxBst: 600, color: '#E879F9' },
    { level: 11, label: 'Champion Muda', minBst: 600, maxBst: 630, color: '#FB923C' },
    { level: 12, label: 'Juara Liga', minBst: 630, maxBst: 660, color: '#FB7185' },
    { level: 13, label: 'Juara Region', minBst: 660, maxBst: 690, color: '#F87171' },
    { level: 14, label: 'Grandmaster', minBst: 690, maxBst: 999, color: '#EF4444' },
    {
        level: 15,
        label: 'Trainer Boss',
        isBoss: true,
        color: '#B91C1C',
        // Mewtwo/Arceus dijamin muncul salah satu, 2 slot lain acak dari pool legendaris kuat ini.
        guaranteedBoss: ['Mewtwo', 'Arceus'],
        supportPool: ['Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Zekrom', 'Reshiram', 'Kyogre', 'Groudon', 'Lugia', 'Ho-Oh'],
    },
];
