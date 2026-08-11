// Trainer stages untuk mode Challenge, berdasarkan total base stat (BST) tim lawan.
// Tiap stage lawan adalah trainer dengan tim 3 Pokemon. Stage terakhir menghadirkan
// trainer boss dengan tim berisi Mewtwo/Arceus + legendaris kuat lain.
export const CHALLENGE_LEVELS = [
    { level: 1, label: 'Trainer Pemula', minBst: 0, maxBst: 320, color: '#94A3B8' },
    { level: 2, label: 'Trainer Berpengalaman', minBst: 320, maxBst: 400, color: '#4ADE80' },
    { level: 3, label: 'Gym Leader', minBst: 400, maxBst: 480, color: '#60A5FA' },
    { level: 4, label: 'Elite Four', minBst: 480, maxBst: 560, color: '#A78BFA' },
    { level: 5, label: 'Juara Liga', minBst: 560, maxBst: 999, color: '#FB923C' },
    {
        level: 6,
        label: 'Trainer Boss',
        isBoss: true,
        color: '#EF4444',
        // Mewtwo/Arceus dijamin muncul salah satu, 2 slot lain acak dari pool legendaris kuat ini.
        guaranteedBoss: ['Mewtwo', 'Arceus'],
        supportPool: ['Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Zekrom', 'Reshiram', 'Kyogre', 'Groudon', 'Lugia', 'Ho-Oh'],
    },
];
