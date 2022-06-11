const puppeteer = require('puppeteer')
const fs = require('fs');

const LIST_DATA_SEMINAR_CATEGORIES = [
    {
        'category': 'seni',
        'urlTarget': 'https://eventkampus.com/search?keyword=seni'
    },
    {
        'category': 'teknologi',
        'urlTarget': 'https://eventkampus.com/search?keyword=technology&type=event'
    },
]

const LIST_DATA_COMPTITION_CATEGORIES = [
    {
        'category': 'uncategorized',
        'urlTarget': 'https://planbe.id/info-acara/?s&filter-title=lomba'
    },
]


const processScrapeSeminar = async () => {

    let tempResult = {
        'timeScrapping': new Date(),
        'dataSeminar': []
    };

    for (const dataSeminar of LIST_DATA_SEMINAR_CATEGORIES) {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        const url = dataSeminar.urlTarget
        await page.goto(url)

        if (dataSeminar.category === "seni" || dataSeminar.category === "teknologi") {

            const selector = "div.cd-beasiswa.d-flex.flex-column"

            await page.waitForSelector(selector);

            let tempDataSeminarSeni = [];
            const dataSeminarSeni = await page.$$eval(selector, (cardTemp) => {
                return cardTemp.map((node) => {
                    const judulSeminar = node.querySelector("div.cd-beasiswa__judul > a").innerText;
                    const imageSrcSeminar = node.querySelector("div.cd-beasiswa__foto.img-full > a > img").getAttribute("data-src");
                    const linkSeminar = node.querySelector("div.cd-beasiswa__judul > a[href]").getAttribute("href");
                    return {
                        judulSeminar,
                        imageSrcSeminar,
                        linkSeminar
                    };
                });
            });

            tempDataSeminarSeni = [...tempDataSeminarSeni, ...dataSeminarSeni]
            tempResult.dataSeminar.push(
                {
                    category: dataSeminar.category,
                    length: tempDataSeminarSeni.length,
                    data: tempDataSeminarSeni,
                }
            )
        }

        await browser.close()
    }
    return tempResult;
}

const getPagination = async (url) => {
    let listUrlPagination = []

    const hostname = new URL(url).hostname;
    if (hostname === "planbe.id") {
        let maxPagination = 2;

        // const browser = await puppeteer.launch()
        // const page = await browser.newPage()
        // const url = "https://planbe.id/info-acara/?s&filter-title=lomba"
        // await page.goto(url)

        // const selector = "a.page-numbers"

        // await page.waitForSelector(selector);


        // const listPagination = await page.$$eval(selector, (cardTemp) => {
        //     return cardTemp.map((node) => {
        //         return node.innerText
        //     });
        // });

        // maxPagination = Math.max(...listPagination.map((numPage) => Number(numPage)))

        if (maxPagination !== 0) {
            for(let i = 1; i <= maxPagination; i++) {
                const urlPagination = `https://planbe.id/info-acara/page/${i}/?s&filter-title=lomba`;
                listUrlPagination.push(urlPagination)
            }
        }
        
        // await browser.close()
    }

    return listUrlPagination;

}

const processScrapeCompetition = async () => {

    let tempResult = {
        'timeScrapping': new Date(),
        'dataCompetition': []
    };


    for (const dataCompetition of LIST_DATA_COMPTITION_CATEGORIES) {
        if (dataCompetition.category === "uncategorized") {
            const listUrlPagination = await getPagination(dataCompetition.urlTarget);

            if (listUrlPagination) {

                let tempListDataCompetition = [];

                for (const urlDataCompetition of listUrlPagination) {
                    const browser = await puppeteer.launch()
                    const page = await browser.newPage()
                    const url = urlDataCompetition
                    await page.goto(url)

                    const selector = "div.item-job.col-sm-12.col-md-12.col-xs-12.lg-clearfix.md-clearfix"
                
                    await page.waitForSelector(selector);

                    
                    const listDataCompetition = await page.$$eval(selector, (cardTemp) => {
                        return cardTemp.map((node) => {
                            const titleCompetition = node.querySelector("h2.job-title > a").innerText;
                            const imageSrcCompetition = node.querySelector("div.employer-logo > a > img").getAttribute("src");
                            const linkCompetition = node.querySelector("div.employer-logo > a[href]").getAttribute("href");
                            return {
                                titleCompetition,
                                imageSrcCompetition,
                                linkCompetition
                            };
                        });
                    });

                    console.log(`Success scrape ${listDataCompetition.length} data...`)

                    tempListDataCompetition = [...tempListDataCompetition, ...listDataCompetition]

                    await browser.close()
                    
                }

                tempResult.dataCompetition.push(
                    {
                        category: dataCompetition.category,
                        length: tempListDataCompetition.length,
                        data: tempListDataCompetition,
                    }
                )
                
            } 
        }  
    }
    return tempResult;
}


const writeJsonData = async (ouputFile, data) => {
    fs.writeFile(`./data/${ouputFile}.json`, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('completed');
    });
}

const readJsonData = (file) => {
    const data = fs.readFileSync(`./data/${file}.json`, function (err) {
        if (err) throw err;
    });
    return JSON.parse(data);
}

module.exports = {
    index: async (req, res) => {
        try {
            res.render("index", {
                title: "Hello Raka..."
            })
        } catch (error) {
            console.log(error)
        }
    },

    scrappingSeminar: async (req, res) => {
        try {
            const data = await processScrapeSeminar();
            await writeJsonData("data-seminar", data)
            res.status(200).json({ message: "Data Already Scrapped" })
        } catch (error) {
            console.log(error)
        }
    },

    getDataSeminar: (req, res) => {
        try {
            const data = fs.readFileSync('./data/data-seminar.json', function (err) {
                if (err) throw err;
            });
            res.status(200).json({ data: JSON.parse(data) })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },

    scrappingCompetition: async (req, res) => {
        try {
            const data = await processScrapeCompetition();
            await writeJsonData("data-competition", data)
            res.status(200).json({ message: "Data Already Scrapped" })
        } catch (error) {
            console.log(error)
        }
    },

    getDataCompetition: (req, res) => {
        try {
            const data = fs.readFileSync('./data/data-competition.json', function (err) {
                if (err) throw err;
            });
            res.status(200).json({ data: JSON.parse(data) })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },
    readJsonData
}