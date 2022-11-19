import { calculateDate, calculatePrice, calculateTime } from '../utils/calculations';

describe('Price calculation', () => {
    test('English', () => {
        expect(calculatePrice('en', '.docx', 900)).toBe(120);
        expect(calculatePrice('en', 'other', 500)).toBe(144);

        expect(calculatePrice('en', '.docx', 1233)).toBe(147.96);
        expect(calculatePrice('en', 'other', 1233)).toBe(177.55);
    });

    test('Cyrillic', () => {
        expect(calculatePrice('uk', '.doc', 900)).toBe(50);
        expect(calculatePrice('uk', 'other', 500)).toBe(60);

        expect(calculatePrice('uk', '.docx', 1233)).toBe(61.65);
        expect(calculatePrice('uk', 'other', 1233)).toBe(73.98);
    });

    test('Price for uk text is equal to ru text', () => {
        expect(calculatePrice('uk', '.docx', 900))
            .toBe(calculatePrice('ru', '.docx', 900));

        expect(calculatePrice('uk', 'other', 500))
            .toBe(calculatePrice('ru', 'other', 500));

        expect(calculatePrice('uk', '.docx', 1233))
            .toBe(calculatePrice('ru', '.docx', 1233));

        expect(calculatePrice('uk', 'other', 1233))
            .toBe(calculatePrice('ru', 'other', 1233));
    });

    test('Mimetypes', () => {
        expect(calculatePrice('en', 'none', 900)).toBe(120);
        expect(calculatePrice('en', '.docx', 900)).toBe(120);
        expect(calculatePrice('en', '.doc', 900)).toBe(120);
        expect(calculatePrice('en', '.rtf', 900)).toBe(120);

        expect(calculatePrice('en', 'other', 900)).toBe(144);
        expect(calculatePrice('en', '', 900)).toBe(144);
    });
});

describe('Time calculation', () => {
    test('English', () => {
        expect(calculateTime('en', '.docx', 100)).toBe(3600000);
        expect(calculateTime('en', 'other', 100)).toBe(4320000);

        expect(calculateTime('en', '.docx', 500)).toBe(7205405);
        expect(calculateTime('en', 'other', 500)).toBe(8646486);
    });

    test('Cyrillic', () => {
        expect(calculateTime('uk', '.docx', 100)).toBe(3600000);
        expect(calculateTime('uk', 'other', 100)).toBe(4320000);

        expect(calculateTime('uk', '.docx', 1000)).toBe(4500675);
        expect(calculateTime('uk', 'other', 1000)).toBe(5400810);
    });

    test('Time for uk text is equal to ru text', () => {
        expect(calculateTime('uk', '.docx', 500))
            .toBe(calculateTime('ru', '.docx', 500));

        expect(calculateTime('uk', 'other', 500))
            .toBe(calculateTime('ru', 'other', 500));

        expect(calculateTime('uk', '.docx', 1233))
            .toBe(calculateTime('ru', '.docx', 1233));

        expect(calculateTime('uk', 'other', 1233))
            .toBe(calculateTime('ru', 'other', 1233));
    });

    test('Mimetypes', () => {
        expect(calculateTime('en', 'none', 100)).toBe(3600000);
        expect(calculateTime('en', '.docx', 100)).toBe(3600000);
        expect(calculateTime('en', '.doc', 100)).toBe(3600000);
        expect(calculateTime('en', '.rtf', 100)).toBe(3600000);

        expect(calculateTime('en', 'other', 100)).toBe(4320000);
        expect(calculateTime('en', '', 100)).toBe(4320000);
    });
});


describe('Date calculation', () => {
    const hour = 1000 * 60 * 60;

    test('Before 10:00', () => {
        const startDate = new Date('December 1, 2022 09:00:00');
        const endDate = new Date('December 1, 2022 11:00:00');
        expect(calculateDate(startDate, hour))
            .toEqual(endDate);
    });

    test('After 19:00', () => {
        const startDate = new Date('December 1, 2022 19:00:00');
        const endDate = new Date('December 2, 2022 11:00:00');
        expect(calculateDate(startDate, hour))
            .toEqual(endDate);
    });

    test('Before weekend', () => {
        const startDate = new Date('December 2, 2022 18:00:00');
        const endDate = new Date('December 5, 2022 11:00:00');
        expect(calculateDate(startDate, 2 * hour))
            .toEqual(endDate);
    });

    test('More than week', () => {
        const startDate = new Date('December 2, 2022 19:00:00');
        const endDate = new Date('December 12, 2022 19:00:00');
        expect(calculateDate(startDate, 6 * 9 * hour))
            .toEqual(endDate);
    });
});
