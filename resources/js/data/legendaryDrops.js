// Pool Pokemon legendaris/mitos non-evolusi untuk tier gacha "Legendaris".
export const LEGENDARY_DROP_POOL = [
    'Mewtwo', 'Mew', 'Lugia', 'Ho-Oh', 'Celebi', 'Rayquaza', 'Jirachi', 'Deoxys',
    'Dialga', 'Palkia', 'Giratina', 'Darkrai', 'Shaymin', 'Zekrom', 'Reshiram',
    'Kyurem', 'Victini', 'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa',
    'Volcanion', 'Solgaleo', 'Lunala', 'Necrozma', 'Marshadow', 'Zeraora',
    'Zacian', 'Zamazenta', 'Eternatus', 'Kyogre', 'Groudon', 'Regigigas',
];

export const DROP_EVERY_N_WINS = 3;

// Metadata tampilan tiap tier gacha. Persentase-nya diatur admin (bukan hardcode di sini)
// lewat /admin/gacha, dan di-roll server-side via endpoint /api/tarung/gacha-roll.
export const GACHA_TIERS = {
    legendary: { label: 'Legendaris', color: '#F59E0B', emoji: '🌟' },
    secondEvo: { label: 'Evolusi Tahap 2', color: '#8B5CF6', emoji: '⭐' },
    nonEvo: { label: 'Pokemon Baru', color: '#64748B', emoji: '🎁' },
    bonusEvolution: { label: 'Bonus Evolusi', color: '#22C55E', emoji: '🧬' },
};
