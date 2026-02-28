import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// Using standard PDF fonts that don't require external files
const fonts = {
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    }
};

const printer = new PdfPrinter(fonts);

export const generateATSResumePDF = (optimizedData: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const { header, summary, skills, experience, projects, education } = optimizedData;

            const totalItems = (experience?.length || 0) + (projects?.length || 0);
            const isDense = totalItems >= 4;

            const baseFontSize = isDense ? 10.5 : 11;
            const headerFontSize = isDense ? 18 : 22;
            const sectionHeaderSize = isDense ? 12 : 14;

            const sectionMarginTop = isDense ? 8 : 10;
            const sectionMarginBottom = isDense ? 10 : 15;
            const itemMarginBottom = isDense ? 6 : 10;
            const subtextMarginBottom = isDense ? 3 : 5;

            const docDefinition: TDocumentDefinitions = {

                pageMargins: [40, 40, 40, 40],
                defaultStyle: {
                    font: 'Times',
                    fontSize: baseFontSize,
                    lineHeight: isDense ? 1.15 : 1.2
                },
                content: [
                    // HEADER
                    { text: header?.name || 'Name', style: 'header', alignment: 'center' },
                    {
                        text: [
                            header?.email || '',
                            header?.phone ? ` | ${header.phone}` : '',
                            header?.linkedin ? ` | ${header.linkedin}` : '',
                            header?.github ? ` | ${header.github}` : ''
                        ].join(''),
                        alignment: 'center',
                        margin: [0, 0, 0, sectionMarginBottom]
                    },

                    // SUMMARY
                    ...(summary ? [
                        { text: 'PROFESSIONAL SUMMARY', style: 'sectionHeader' },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, subtextMarginBottom * 2] },
                        { text: summary, margin: [0, 0, 0, sectionMarginBottom] }
                    ] : []),

                    // SKILLS
                    ...(skills && Object.keys(skills).length > 0 ? [
                        { text: 'SKILLS', style: 'sectionHeader' },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, subtextMarginBottom * 2] },
                        {
                            ul: [
                                ...(skills.languages ? [`Languages: ${skills.languages}`] : []),
                                ...(skills.frameworks ? [`Frameworks: ${skills.frameworks}`] : []),
                                ...(skills.tools ? [`Tools & Technologies: ${skills.tools}`] : []),
                                ...(skills.other ? [`Other: ${skills.other}`] : [])
                            ],
                            margin: [0, 0, 0, sectionMarginBottom]
                        }
                    ] : []),

                    // EXPERIENCE
                    ...(experience && experience.length > 0 ? [
                        { text: 'EXPERIENCE', style: 'sectionHeader' },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, subtextMarginBottom * 2] },
                        ...experience.map((exp: any) => ([
                            {
                                columns: [
                                    { text: exp.role, style: 'boldText' },
                                    { text: exp.dates, alignment: 'right', style: 'boldText' }
                                ]
                            },
                            { text: exp.company, italics: true, margin: [0, 0, 0, subtextMarginBottom] },
                            {
                                ul: exp.bullets || [],
                                margin: [0, 0, 0, itemMarginBottom]
                            }
                        ])).flat()
                    ] : []),

                    // PROJECTS
                    ...(projects && projects.length > 0 ? [
                        { text: 'PROJECTS', style: 'sectionHeader' },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, subtextMarginBottom * 2] },
                        ...projects.map((proj: any) => ([
                            {
                                text: [
                                    { text: proj.name, style: 'boldText' },
                                    proj.techStack ? ` | ${proj.techStack}` : ''
                                ],
                                margin: [0, 0, 0, subtextMarginBottom]
                            },
                            {
                                ul: proj.bullets || [],
                                margin: [0, 0, 0, itemMarginBottom]
                            }
                        ])).flat()
                    ] : []),

                    // EDUCATION
                    ...(education && education.length > 0 ? [
                        { text: 'EDUCATION', style: 'sectionHeader' },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, subtextMarginBottom * 2] },
                        ...education.map((edu: any) => ([
                            {
                                columns: [
                                    { text: edu.university, style: 'boldText' },
                                    { text: edu.year, alignment: 'right', style: 'boldText' }
                                ]
                            },
                            { text: edu.degree, margin: [0, 0, 0, itemMarginBottom] }
                        ])).flat()
                    ] : [])
                ],
                styles: {
                    header: {
                        fontSize: headerFontSize,
                        bold: true,
                        margin: [0, 0, 0, subtextMarginBottom]
                    },
                    sectionHeader: {
                        fontSize: sectionHeaderSize,
                        bold: true,
                        margin: [0, sectionMarginTop, 0, 4]
                    },
                    boldText: {
                        bold: true
                    }
                }
            };

            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const chunks: Buffer[] = [];

            pdfDoc.on('data', (chunk) => {
                chunks.push(chunk);
            });

            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve(result);
            });

            pdfDoc.end();
            return;
        } catch (error) {
            reject(error);
        }
    });
};
