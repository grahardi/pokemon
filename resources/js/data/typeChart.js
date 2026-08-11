// Type effectiveness chart (sama dengan config/pokemon.php di backend).
// double = 2x damage, half = 0.5x damage, none = 0x damage. Selain itu 1x (netral).
export const TYPE_CHART = {
    Normal: { double: [], half: ['Rock', 'Steel'], none: ['Ghost'] },
    Fire: { double: ['Grass', 'Ice', 'Bug', 'Steel'], half: ['Fire', 'Water', 'Rock', 'Dragon'], none: [] },
    Water: { double: ['Fire', 'Ground', 'Rock'], half: ['Water', 'Grass', 'Dragon'], none: [] },
    Electric: { double: ['Water', 'Flying'], half: ['Electric', 'Grass', 'Dragon'], none: ['Ground'] },
    Grass: { double: ['Water', 'Ground', 'Rock'], half: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], none: [] },
    Ice: { double: ['Grass', 'Ground', 'Flying', 'Dragon'], half: ['Fire', 'Water', 'Ice', 'Steel'], none: [] },
    Fighting: { double: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], half: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], none: ['Ghost'] },
    Poison: { double: ['Grass', 'Fairy'], half: ['Poison', 'Ground', 'Rock', 'Ghost'], none: ['Steel'] },
    Ground: { double: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], half: ['Grass', 'Bug'], none: ['Flying'] },
    Flying: { double: ['Grass', 'Fighting', 'Bug'], half: ['Electric', 'Rock', 'Steel'], none: [] },
    Psychic: { double: ['Fighting', 'Poison'], half: ['Psychic', 'Steel'], none: ['Dark'] },
    Bug: { double: ['Grass', 'Psychic', 'Dark'], half: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], none: [] },
    Rock: { double: ['Fire', 'Ice', 'Flying', 'Bug'], half: ['Fighting', 'Ground', 'Steel'], none: [] },
    Ghost: { double: ['Psychic', 'Ghost'], half: ['Dark'], none: ['Normal'] },
    Dragon: { double: ['Dragon'], half: ['Steel'], none: ['Fairy'] },
    Dark: { double: ['Psychic', 'Ghost'], half: ['Fighting', 'Dark', 'Fairy'], none: [] },
    Steel: { double: ['Ice', 'Rock', 'Fairy'], half: ['Fire', 'Water', 'Electric', 'Steel'], none: [] },
    Fairy: { double: ['Fighting', 'Dragon', 'Dark'], half: ['Fire', 'Poison', 'Steel'], none: [] },
};

export const TYPE_COLORS = {
    Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Electric: '#F8D030',
    Grass: '#78C850', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
    Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
    Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848',
    Steel: '#B8B8D0', Fairy: '#EE99AC',
};

/**
 * Hitung effectiveness multiplier sebuah tipe serangan terhadap kombinasi tipe defender.
 */
export function getEffectiveness(attackType, defenderTypes) {
    const rules = TYPE_CHART[attackType];
    if (!rules) return 1;

    let multiplier = 1;
    for (const defType of defenderTypes) {
        if (rules.double.includes(defType)) multiplier *= 2;
        else if (rules.half.includes(defType)) multiplier *= 0.5;
        else if (rules.none.includes(defType)) multiplier *= 0;
    }
    return multiplier;
}
