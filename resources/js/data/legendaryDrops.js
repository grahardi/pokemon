// Pool Pokemon legendaris/mitos non-evolusi untuk sistem drop acak di mode Challenge.
// Ini Pokemon yang tidak punya rantai evolusi (tidak bisa didapat lewat fitur Evolusi biasa),
// jadi drop ini adalah satu-satunya cara mendapatkannya di Arena Tarung.
export const LEGENDARY_DROP_POOL = [
    'Mewtwo', 'Mew', 'Lugia', 'Ho-Oh', 'Celebi', 'Rayquaza', 'Jirachi', 'Deoxys',
    'Dialga', 'Palkia', 'Giratina', 'Darkrai', 'Shaymin', 'Zekrom', 'Reshiram',
    'Kyurem', 'Victini', 'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa',
    'Volcanion', 'Solgaleo', 'Lunala', 'Necrozma', 'Marshadow', 'Zeraora',
    'Zacian', 'Zamazenta', 'Eternatus', 'Kyogre', 'Groudon', 'Regigigas',
];

export const DROP_EVERY_N_WINS = 3;

// Peluang tiap tier gacha (total harus 100%)
export const GACHA_TIERS = {
    legendary: { chance: 0.10, label: 'Legendaris', color: '#F59E0B', emoji: '🌟' },
    secondEvo: { chance: 0.25, label: 'Evolusi Tahap 2', color: '#8B5CF6', emoji: '⭐' },
    common: { chance: 0.65, label: 'Pokemon Baru', color: '#64748B', emoji: '🎁' },
};
