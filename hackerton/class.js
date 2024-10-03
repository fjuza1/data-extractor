class CityDesign {
    _cityDesign(options,a,b){
        return this._cityGridLayout(options.cityLayout,a,b);
    }
    _cityGridLayout(layout, a , b){
        if(layout === 'rectangle' && b === undefined) return `Rectangle accepts width and height`
        if (layout === 'square') return `${a ** 2} m²`
        if (layout === 'rectangle') return `${a*b} m²`
    }
}
const city  = new CityDesign();
console.log(city._cityDesign({cityLayout: 'square'},10));