const dataRand = {
    uuid() {
        pm.environment.set('ranUUID', uuid.v4())
    },
    integer() {
        const intDate = new Date().getTime()
        if (intDate === parseInt(intDate, 10) && Number.isSafeInteger(intDate)) pm.environment.set('int', intDate)
    },
    boolean(cislo) {
        return Math.random() < cislo
    },
    dnes() {
        return new Date().toISOString().slice(0, 19)
    },
    odNahodnyDate(ds) {
        const dates = ds 
        const nahodnyRok = dates.getFullYear() + (Math.floor(Math.random() * 2 + 1));
        const nahodnyMesiac = dates.getMonth() + 1 + (Math.floor(Math.random() * (12 - dates.getMonth())));
        const dniVmesiaci = (rok, mesiaci) => new Date(rok, mesiaci, 0).getDate();
        const zvysneDni = dniVmesiaci(nahodnyRok, nahodnyMesiac) - new Date().getDate() - 2;
        dates.setFullYear(nahodnyRok);
        dates.setMonth(nahodnyMesiac);
        dates.setDate(zvysneDni);
        return dates.toISOString(ds).slice(0, 19)
        //pm.environment.set('datumOd',dates)
    },
    doNahodnyDate (date){
        return this.odNahodnyDate(date)
    }
}
const when = dataRand.odNahodnyDate(new Date())
console.log("🚀 ~ when:", when)
console.log(dataRand.doNahodnyDate(new Date((when))));
//pm.environment.set('bool', dataRand.boolean(0.4))
const date = new Date();
date.setDate(date.getDate() * Math.floor(Math.random()) + 1);