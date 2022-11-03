
// Modules
import { sendQuery } from './connect_db'

interface ISnetSearchCriteria {
    [property: string]: string[] | number[];
}

interface ISnetCriteria {
    colsWanted: string[],
    weightType: string,
    searchCriteria: ISnetSearchCriteria
}

const createSnetQuery = (criteria: ISnetCriteria): string => {
    
    let query = `SELECT ${criteria.colsWanted.join(', ')}, SUM(${criteria.weightType}) AS ${criteria.weightType} FROM snet`;

    // if there are filtering criteria
    if ('searchCriteria' in criteria) {
        query = query + ' WHERE ';

        for (const k of Object.keys(criteria.searchCriteria)) {

            if (k === 'year') {
                const minYear: number = Number(criteria.searchCriteria.year[0]);
                const maxYear: number = Number(criteria.searchCriteria.year[1]);

                query = query + `year >= ${minYear} AND year <= ${maxYear} AND `
            }
            else {
                let currCriteria: string[] = criteria.searchCriteria[k].map((item: string | number): string => {
                    return `\'${item}\'`;
                });
    
                query = query + `${k} in (${currCriteria.join(', ')}) AND `
            }
        }

        query = query.slice(0, query.length - 5);
    }


    query = query + `GROUP BY ${criteria.colsWanted.join(', ')}`;
    return query;
}

export const sendSnetQuery = async (criteria: ISnetCriteria) => {

    const query = createSnetQuery(criteria);
    try {
        const resp = await sendQuery(query);
        return resp;
    }
    catch(e) {
        console.log(e);
    }
}

