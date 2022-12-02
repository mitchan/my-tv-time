import * as cheerio from 'cheerio';

import config from '../../core/config';
import { HttpClient } from '../../utils/httpClient';
import { wait } from '../../utils/wait';

type FilmLink = {
    text: string;
    href: string;
};

const httpClient = new HttpClient();

export async function loadTop(): Promise<void> {
    const data = await httpClient.get(`${config.paths.imdb}/chart/top/`);

    const $ = cheerio.load(data);

    const links: FilmLink[] = [];
    $('td.titleColumn a').each((i, el) => {
        const data = getLinkData($, el);
        links.push(data);
    });

    for (let link of links) {
        await loadFilm(link);
        await wait();
    }
}

function getLinkData($: cheerio.CheerioAPI, el: cheerio.Element): FilmLink {
    const href = $(el).attr('href');
    const text = $(el).text();

    if (!href) {
        throw new Error(`Cannot find href for ${el}`);
    }

    return { href, text };
}

async function loadFilm(link: FilmLink): Promise<void> {
    const url = `${config.paths.imdb}${link.href}`;

    const data = await httpClient.get(url);

    const $ = cheerio.load(data);

    const id = link.href.split('/')[2];
    const title = $('[data-testid="hero-title-block__title"]').text();
    const score = $(
        '[data-testid="hero-rating-bar__aggregate-rating__score"] span',
    )
        .first()
        .text();

    console.log({ id, title, score });
}
