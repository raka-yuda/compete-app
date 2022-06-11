const Scrap = require('../scrape/controller')


module.exports = {
    getDataSeminar: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus}

            const dataSeminar = Scrap.readJsonData("data-seminar");
            
            // console.log(dataSeminar)

            res.render("template/dashboard", {
                alert,
                title: "Compete App | Dashboard",
                activePath: "Seminar",
                user: req.session.user,
                dataSeminar,
                content: "dashboard/skill/view_seminar"
            })
            
        } catch (error) {
            console.log(error)
        }
    },

    getDataContest: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = { message: alertMessage, status: alertStatus}

            const dataCompetition = Scrap.readJsonData("data-competition") ?? [];

            console.log(dataCompetition)

            res.render("template/dashboard", {
                alert,
                title: "Compete App | Dashboard",
                activePath: "Contest",
                user: req.session.user,
                dataCompetition,
                content: "dashboard/skill/view_competition"
            })
            // console.log(dataSeminar)
            
        } catch (error) {
            console.log(error)
        }
    },
    
}