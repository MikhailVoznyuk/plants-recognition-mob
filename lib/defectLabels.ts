// Русская интерполяция названий дефектов + синонимы
export function ruDefectLabel(raw?: string): string {
    if (!raw) return 'дефект';
    const s = String(raw).toLowerCase().trim();

    const map: Record<string, string> = {
        fungus: 'гриб(ы)',
        fruiting_bodies: 'плодовые тела',
        cavity: 'дупло',
        hollow: 'дупло',
        crack: 'трещина (ствола/коры)',
        fissure: 'трещина (ствола/коры)',
        mech_damage: 'механические повреждения (ствола/коры)',
        mechanical_damage: 'механические повреждения (ствола/коры)',
        bark_damage: 'механические повреждения (ствола/коры)',
        crown_damage: 'повреждение кроны / облом кроны',
        crown_breakage: 'повреждение кроны / облом кроны',
        pests: 'вредители',
        insect_damage: 'вредители',
        borer: 'вредители',
        rot: 'гниль (стволовая/комлевая)',
        stem_rot: 'гниль (стволовая/комлевая)',
        trunk_rot: 'гниль (стволовая/комлевая)',
        butt_rot: 'гниль (стволовая/комлевая)',
        canker: 'рак (язвенная болезнь коры)',
        dieback: 'усыхание ветвей',
        dry_branches: 'усыхание ветвей',
        leaf_spot: 'пятнистости',
        rust: 'ржавчина',
        mildew: 'мучнистая роса',
        bark_peeling: 'отслоение коры',
        oozing: 'выделения смолы/камедетечение',
        exudate: 'выделения смолы/камедетечение',
        root_damage: 'повреждение корней',
        frost_crack: 'морозобойная трещина',
        lightning_strike: 'поражение молнией',
    };

    if (map[s]) return map[s];
    for (const part of s.split(/[\s/,_-]+/)) {
        if (map[part]) return map[part];
    }
    return raw;
}

// Преобразуем health_grade → числовой score под ваш bucketByScores
// < 0.34 = good, < 0.67 = medium, иначе bad
export function gradeToBucketScore(health?: string): number | undefined {
    if (!health) return undefined;
    const h = health.toLowerCase();
    if (h === 'good') return 0.1;
    if (h === 'fair' || h === 'ok' || h === 'medium') return 0.5;
    if (h === 'bad' || h === 'poor' || h === 'critical') return 0.9;
    return undefined;
}
