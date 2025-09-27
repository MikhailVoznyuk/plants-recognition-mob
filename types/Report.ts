type Score = 1 | 2 | 3

export type ReportObject = {
    plantType: 'tree' | 'shrub', // Можно 0 или 1
    species: string,
    healthScore: Score,
    cavityScore: Score,
    crackScore: Score,
    mechDamageScore: Score,
    fungusScore: Score,
    description: string,
}

type Report = {
    id: number;
    date: string;
    objects: ReportObject[];
}