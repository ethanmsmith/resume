'use-strict';
import moment from 'moment';
type cvSkill = {
    category: string,
    skills: string[]
}

export type cvItem = {
    text: string
}

type basics = {
    name: string,
    label: string,
    picture: string,
    email: string,
    website: string,
    summary: string,
    location: {
        address: string,
        postalCode: string,
        city: string,
        countryCode: string,
        region: string
    },
    profiles: {
        network: string,
        username: string,
        url: string
    }[]
}

const cvItem = (item: cvItem) =>
    `\\item {${item.text.replace('#', '\\#').replace('%', '\\%')}}`;
const cvItems = (items: cvItem[]) =>
    `\\begin{cvitems}
        ${items.map(item => cvItem(item)).join('\n')}
    \\end{cvitems}`;
const cvSkill = (category: string, skills: string[]) =>
    `\\cvskill
        {${category}}
        {${skills.join(', ').replace('#', '\\#').replace('%', '\\%')}}`;
const cvSkills = (skills: cvSkill[]) =>
    `\\begin{cvskills}
        ${skills.map(skill => cvSkill(skill.category, skill.skills)).join('\n')}
    \\end{cvskills}`
const cvEntry = (firstRow: string, secondRow: string, thirdRow: string, startDate: string, endDate: string, list: cvItem[]) =>
    `\\cventry
        {${firstRow}}
        {${secondRow}}
        {${thirdRow}}
        {${moment(startDate).format('YYYY.M.D')} - ${endDate !== "Present" ? moment(endDate).format('YYYY.M.D') : "Present"}}
        {
            ${cvItems(list)}
        }`;

const cvPersonal = (person: basics) => `
    \\name{${person.name.split(' ')[0]}}{${person.name.split(' ')[1]}}
    \\position{${person.label}}
    \\address{${person.location.address} ${person.location.city}, ${person.location.region} ${person.location.postalCode}}
    \\email{${person.email}}
    \\homepage{${person.website}}
    ${person.profiles.filter(profile => profile.network === 'Github').length === 1 ? "\\github{" + person.profiles.filter(profile => profile.network === 'Github')[0].username + "}" : null}
    ${person.profiles.filter(profile => profile.network === 'LinkedIn').length === 1 ? "\\linkedin{" + person.profiles.filter(profile => profile.network === 'LinkedIn')[0].username + "}" : null}
`;

export const experience = (JobTitle: string, Organization: string, Location: string, StartDate: string, EndDate: string, Summary: string, highlights: cvItem[]) =>
    cvEntry(JobTitle, Organization, Location, StartDate, EndDate, [{ text: Summary }, ...highlights]);

export const skill = (Category: string, Skills: string[]) =>
    cvSkill(Category, Skills);

export const education = (Degree: string, University: string, Location: string, StartDate: string, EndDate: string, Classes: string[]) =>
    cvEntry(Degree, University, Location, StartDate, EndDate, [{ text: Classes.join(', ') }]);

export const personal = (person: basics) =>
    cvPersonal(person);

export const summary = (summary: string) =>
    summary;