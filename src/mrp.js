class mrp{
    constructor(parent, schema, title="default", popyt, na_stanie, czas_realizacji){

        this.loopControl = 1 //This value controls the loop

        this.loopIterator = 0 //this value shows how many loop functions have happened
        this.rowOverflow = 0
        this.cellOverflow = 0

        this.parent = parent
        this.schema = schema
        this.popyt = popyt
        this.na_stanie = na_stanie
        this.czas_realizacji = czas_realizacji
        this.updateGHP()
        var parentElement = document.getElementById(parent)
        var xBlocks = this.getMaxWeek() + 1
        this.xBlocks = xBlocks
        var yBlocks = 4
        this.productionListCells = []
        this.productionListAmount = []
        var xCellSize = 80
        var yCellSize = 30
        var formContent = document.getElementById("form.contentBox")
        formContent.remove()
        var contentBox = document.createElement("div")
        contentBox.id = title+".contentBox"
        contentBox.classList.add("contentBox")
        parentElement.appendChild(contentBox)
        this.GHPTable = new table(contentBox, xBlocks, yBlocks, "GHP", this.GHP, this)
        this.PodstawaTable = new table(contentBox, xBlocks, 7, "Podstawa", this.Podstawa, this)
        this.GoraTable = new table(contentBox, xBlocks, 7, "Góra", this.Gora, this)
        this.FilarTable = new table(contentBox, xBlocks, 7, "Filar", this.Filar, this)
        this.NogaTable = new table(contentBox, xBlocks, 7, "Noga", this.Noga, this)
        this.PodlogaTable = new table(contentBox, xBlocks, 7, "Podłoga", this.Podloga, this)
        this.DachTable = new table(contentBox, xBlocks, 7, "Dach", this.Dach, this)
        this.HaczykTable = new table(contentBox, xBlocks, 7, "Haczyk", this.Haczyk, this)

        this.tables = {
            "GHP": this.GHPTable,
            "Podstawa": this.PodstawaTable,
            "Góra": this.GoraTable,
            "Filar": this.FilarTable,
            "Noga": this.NogaTable,
            "Podłoga": this.PodlogaTable,
            "Dach": this.DachTable,
            "Haczyk": this.HaczykTable
        }
    

        this.currentCell = this.GHPTable.content["1-1"]
        
        this.updateAfter("GHP", "1-1","0")
        this.updateAfter("GHP", "1-3",this.na_stanie)
        for(var week in this.popyt) {
            this.gc("GHP", (week) + "-1")
            this.write(this.popyt[week]) 
        }

        this.loop()
    }

    loop(){
        this.updateAvailabilityInGHP()
        this.checkAfter("GHP", "1-3","1")
        this.calcultateMRP("Podstawa", "GHP")
        this.calcultateMRP("Góra", "GHP")
        this.calcultateMRP("Filar", "Góra")
        this.calcultateMRP("Noga", "Podstawa")
        this.calcultateMRP("Podłoga", "Podstawa")
        this.calcultateMRP("Dach", "Góra")
        this.calcultateMRP("Haczyk", "Góra")
    }

    updateAvailabilityInGHP() {
        this.updateAfter("GHP", "1-3",this.na_stanie)
        for (var i = 1; i<this.xBlocks; i++){
            this.gc("GHP", i + "-3")
            var previousCellValue = parseInt(this.gcv("GHP", (i-1)+"-3"))
            if(i==1) previousCellValue = this.read()
            this.write(previousCellValue-this.gcv("GHP", i+"-1")+this.gcv("GHP", i+"-2"))
        }
    }

    anc(){
        parent = this.currentCell.parent
        this.verifyID(parent.nextX(this.currentCell.id))
        this.currentCell = parent.content[parent.nextX(this.currentCell.id)]
        
    } //Access Next Cell
    anr(){
        parent = this.currentCell.parent
        this.verifyID(parent.nextY(this.currentCell.id))
        this.currentCell = parent.content[parent.nextY(this.currentCell.id)]
    } //Access Next Row
    apc(){
        parent = this.currentCell.parent
        this.verifyID(parent.prevX(this.currentCell.id))
        if (this.cellOverflow == 0){
            this.currentCell = parent.content[parent.prevX(this.currentCell.id)]
        }
        
    } //Access Previous Cell
    apr(){
        parent = this.currentCell.parent
        this.verifyID(parent.prevY(this.currentCell.id))
        if (this.rowOverflow == 0){
            this.currentCell = parent.content[parent.prevY(this.currentCell.id)]
        }
        
    } //Access Previous Row
    gc(tableName, id){
        this.currentCell = this.tables[tableName].content[id]
    } //Get Cell
    gcv(tableName, id){
        var table = this.tables[tableName]
        return table.content[id].value
    } //Get Cell Value
    write(value){
        this.currentCell.writeValue(value)
    }
    read(){
        return parseInt(this.currentCell.value)
    }
    verifyID(id){
        id = id.split("-")
        if (parseInt(id[0])<1 || id[1]<1|| parseInt(id[0])>this.xSize-1 || parseInt(id[1])<0 || parseInt(id[1])>this.ySize-1 || id[0] == "" || id[1] == "" ||id[0] == "-" || id[1] == "-"){
            console.log(id[0],"HIT OVERFLOW", id[1])
            if (parseInt(id[0])<1){
                this.cellOverflow = 1
            }
            if (parseInt(id[1])<1){
                this.rowOverflow = 1
            }
            return 0
        }else{
            return 0
        }
    }
    updateAfter(tableName, id, value){
        this.gc(tableName, id)
        
        console.log(this.currentCell)
        for (var i = id.split("-")[0]; i<this.xBlocks; i++){
            console.log(value)
            this.write(value)

            console.log("superWriter",i)
            if(i < this.xBlocks-1){
                this.anc()
            }
        }
    }

    checkAfter(tableName, id, demandRow){
        console.log("Filling production row using production_size from form,\n")
        var week =  id.split("-")[0]
        for (var i = week; i<this.xBlocks; i++){
            this.gc(tableName, i+"-3")
            console.log("----------------\nCurrentCell: "+ this.currentCell.id)
            console.log("InStock: ",this.read())
            console.log("To compare cellId:", i+"-"+demandRow, "value: ", this.gcv(tableName, i+"-"+demandRow))
            var popytValue = this.gcv(tableName, i+"-"+demandRow)

            if(popytValue == 0){
                console.log("nothing to do")
            }else{
                if (popytValue > this.read()){
                    console.log("GO TO PRODUCTION, popyt ABOVE AVAILABLE")
                    var inStock = this.read()
                    console.log("currentCell: ", this.currentCell.id)
                    this.gc(tableName, i+"-2")
                    

                    console.log("currentCell: ", this.currentCell)
                    console.log("read - popyt,", this.read(), popytValue)
                    var subtracted = inStock - popytValue
                    
                    this.gc(tableName,  i+"-3")
                    
                }else{
                    console.log(popytValue, this.read())
                    console.log("NOT PRODUCED")
                    var subtracted = this.read() - popytValue
                    console.log(subtracted)
                    this.write(subtracted)
                    this.updateAfter(tableName, this.currentCell.id, subtracted)
                    this.gc(tableName, this.currentCell.id)
                }
            }
        }

        
    }
    updateProduction(id){
        this.gc("GHP", id)
        
        console.log(this.getProductionSize("GHP"))

        
    }
    getMaxWeek() {
        var max = 0;
        for(var week in this.popyt) {
            if(parseInt(week) > max) {
                max = parseInt(week);
            }
        }
        return max
    }
    getProductionSize(tableName){
        var i = tableName == "GHP" ? 4 : 7
        return parseInt(this.tables[tableName].schema[i]["Wielkość partii"])
    }

    getProductionTime(tableName){
        var i = tableName == "GHP" ? 4 : 7
        return parseInt(this.tables[tableName].schema[i]["Czas realizacji"])
    }

    tagProduction(id, value){
        this.productionListCells.push(id)
        console.log("Start production in cells", this.productionListCells)
        this.write(value)
    }

    slotProduction(id, iterations){
        this.gc("GHP",id)
        this.apc()
        console.log("Entered Slot Production")
        console.log(j)
        for(var j = 0 ; j<iterations;j++){
            console.log(j)
            this.checkProduction()
            
        }
        
    }
    checkProduction(){
        console.log("land of rebase",this.currentCell.parent.prevX(this.currentCell.id))
        console.log(this.gcv("GHP", this.currentCell.parent.prevX(this.currentCell.id)))
        var productionSize = this.getProductionTime("GHP")
        
        if(this.currentCell.value == ''){
            for(var i = 0; i < productionSize ; i++){
                console.log("ASKO2",productionSize)
                if(awareProduction){
                    this.write("X")
                }
                
                if(!(productionSize-1 == i)){
                    this.apc()
                }
                
            }
            this.write(this.getProductionBatch(this.currentCell.parent.name))
            this.calcultateMRP("Podstawa", "GHP")
            this.calcultateMRP("Góra", "GHP")
            this.calcultateMRP("Filar", "Góra")
            this.calcultateMRP("Noga", "Podstawa")
            this.calcultateMRP("Podłoga", "Podstawa")
            this.calcultateMRP("Dach", "Góra")
            this.calcultateMRP("Haczyk", "Góra")

            var currentID = this.currentCell.id
            console.log(currentID)


        }else if(this.currentCell.value > 0 && this.gcv("GHP", this.currentCell.parent.prevX(this.currentCell.id)) == ""){
            for(var i = 0; i < productionSize ; i++){
                console.log("ASKO2",productionSize)
                if(awareProduction){
                    this.write("X")
                }
                
                if(!(productionSize-1 == i)){
                    this.apc()
                }
                
            }
            this.write(this.getProductionSize("GHP"))
            this.updateProductionInTable("Podstawa", "GHP")
            this.updateProductionInTable("Góra", "GHP")

            var currentID = this.currentCell.id
            console.log(currentID)
        }else if(this.currentCell.value == "X" || this.currentCell.value > 0){
          
            if(this.cellOverflow){
                this.write("Produkcja poza zakresem czasowym")
            }else{
                this.apc()
                this.checkProduction()
            }
            
        }
        
    }

    calcultateMRP(tableName, parentTableName){
        var table = this.tables[tableName]
        this.updateProductionInTable(tableName, parentTableName)
        this.updateAvailabilityInTable(table)
        this.updateNetDemand(tableName, "1")
        this.planOrders(tableName)
        this.updateOrderRecieve(tableName, table)
    }  
    
    updateNetDemand(tableName, week) {
        this.updateAfter(tableName, week+"-4", "0")
        
        for (var i = 1; i<this.xBlocks; i++){
            var inStock = this.gcv(tableName, i+"-3")
            if( inStock < 0) {
                this.gc(tableName, i+"-4")
                this.write(inStock * (-1))
                }
        }
    }

    updateOrderRecieve(tableName, table){
        var productionTime = this.getProductionTime(tableName)
        for (var i=1; i<this.xBlocks-1; i++){
            this.gc(table.name, i+'-5')
            var value = parseInt(this.currentCell.value)
            if (value != 0) {
                this.gc(table.name, i + productionTime +"-6")
                this.write(value)
                this.updateNetDemand(table.name, i + productionTime + 1)

            }
        }
    }

    updateAvailabilityInTable(table) {
        this.updateAfter(table.name, "1-3", "0")
        this.updateAfter(table.name, "1-4", "0")
        
        var inStock = table.schema[7]["Na stanie"]

        this.gc(table.name, "1-3")
        if (this.gcv(table.name, "1-2") == "" || this.gcv(table.name, "1-2") == "0" || this.gcv(table.name, "1-2") == 0 ) {
            this.write(inStock - parseInt(this.gcv(table.name, "1-1")))
        } else {
            this.write(inStock + parseInt(this.gcv(table.name, "1-2")) - parseInt(this.gcv(table.name, "1-1")))
        }
        for (var i = 2; i<this.xBlocks; i++){
            this.gc(table.name,  i+"-3")
            var demand = parseInt(this.gcv(table.name, i+"-1"))
            var previousCellValue = parseInt(this.gcv(table.name, (i-1)+"-3"))
            
            if (this.gcv(table.name, i+"-2") !== "" && this.gcv(table.name, i+"-2") !== "0" && this.gcv(table.name, i+"-2") !== 0 ) {
                this.write(previousCellValue - demand + parseInt(this.gcv(table.name, i+"-2")))
            } else {
                this.write(previousCellValue - demand)
            }
            
        }
    }

    updateAvailabilityAfter(tableName, week) {
        this.updateAfter(tableName, week+1 + "-3", "0")
        this.updateAfter(tableName, week+1 + "-4", "0")
        
        this.gc(tableName,  week+"-3")
        if (this.gcv(tableName, "1-2") == "" || this.gcv(tableName, "1-2") == "0" || this.gcv(tableName, "1-2") == 0 ) {
            this.write(this.read() + this.getProductionSize(tableName) + parseInt(this.gcv(tableName, "1-1")))
        } else {
            this.write(this.read() + this.getProductionSize(tableName))
        }
        
        for (var i = week+1; i<this.xBlocks; i++){
            this.gc(tableName,  i+"-3")
            var demand = parseInt(this.gcv(tableName, i+"-1"))
            var previousCellValue = parseInt(this.gcv(tableName, (i-1)+"-3"))
            
            if (this.gcv(tableName, i+"-2") !== "" && this.gcv(tableName, i+"-2") !== "0" && this.gcv(tableName, i+"-2") !== 0 ) {
                this.write(previousCellValue - demand + parseInt(this.gcv(tableName, i+"-2")))
            } else {
                this.write(previousCellValue - demand)
            }
            
        }
    }

    getProductionBatch(tableName) {
        var count = 0
        switch(tableName) {
            case "Filar": count = 4;
                break;
            case "Haczyk": count = 2;
                break;
            default: count = 1;
        }
        var table = this.tables[tableName]
        var data =  tableName == "GHP" ? table.schema[4] : table.schema[7]
        return data["Wielkość partii"] * count
    }

    
    updateProductionInTable(tableName, parentTableId){
        var table = this.tables[tableName]
        var count = 0
         switch(tableName) {
             case "Filar": count = 4;
                 break;
             case "Haczyk": count = 2;
                 break;
             default: count = 1;
         }

        this.updateAfter(table.name, "1-1", "0")
        var productionTime = this.getProductionTime(parentTableId)
        var productionDict = this.getProductionDict(productionTime, parentTableId)
        Object.entries(table.content)
            .filter(element => this.isItCellFromRow(element[0], 1))
            .map(element => {
                var elId = element[0]
                var elValue = element[1]
                var week = elId.split("-")[0]
                
                if(productionDict[week] !== undefined) {
                    elValue.value = productionDict[week] * count
                    elValue.inputField.value = productionDict[week] * count
                }
                
            })
    }

    planOrders(tableName){
        this.updateAfter(tableName, "1-5", "0")
        this.updateAfter(tableName, "1-6", "0")
        for (var i = 1; i<this.xBlocks; i++){
            var netDemand = parseInt(this.gcv(tableName, i+"-4"))
            if(netDemand > 0){
                this.gc(tableName, i - this.getProductionTime(tableName)+"-5")
                this.write(this.getProductionSize(tableName))
                this.updateAvailabilityAfter(tableName, i)
                this.updateNetDemand(tableName, i+1)
            }
        }

    }

    checkAfter2(tableName, id, demandRow, productionRow){
        
        var week =  id.split("-")[0]
        for (var i = week; i<this.xBlocks; i++){
            this.gc(tableName, i+"-3")
            console.log("To compare cellId:", i+"-"+demandRow, "value: ", this.gcv(tableName, i+"-"+demandRow))
            var popytValue = this.gcv(tableName, i+"-"+demandRow)

            if(popytValue == 0){
                
            }else{
                let subtracted = 0 
                if (popytValue > this.read()){
                    
                    var inStock = this.read()
                    console.log("instock", inStock)
                    var productionWeek = i - this.getProductionTime(tableName)

                    
                    console.log("production week",productionWeek)
                    if (productionWeek < 1) {
                        
                        console.log("before prodweek<1",subtracted, popytValue, inStock)
                        
                        subtracted = inStock
                        console.log("after prodweek<1",subtracted)
                    } else {
                        this.gc(tableName, productionWeek+"-"+ productionRow)
                        this.tagProduction(this.currentCell.id, this.getProductionSize(tableName))
                   
                     
                        console.log("before else",subtracted)
                        subtracted = this.getProductionSize(tableName) + inStock
                        console.log("after else",subtracted)
                    }
                    this.gc(tableName,  i+"-3")
                    this.updateAfter(tableName, this.currentCell.id, subtracted)
                    
                }else{
                    subtracted = this.read() - popytValue
                    this.write(subtracted)
                    this.updateAfter(tableName, this.currentCell.id, subtracted)
                    this.gc(tableName, this.currentCell.id)
                }
            }
        }
    }

    getProductionDict(productionTime, tableId) {
        var table = this.tables[tableId]
        if (tableId == "GHP") { return this.getNotEmptyCellsFromRow(table, 2, productionTime)
        } else {return this.getNotEmptyCellsFromRow(table, 6, productionTime)}
    }

    getNotEmptyCellsFromRow(table, rowId, productionTime) {
        var productionDict = {}
        for(const [key, value] of Object.entries(table.content)) {
            if(this.isItCellFromRow(key, rowId) && !this.isItCellFromCol(key, 0) && parseInt(value.value) > 0){
                var properWeek = parseInt(key.split("-")[0]) - productionTime
                productionDict[properWeek] = value.value.toString()     
            } 
        }
        return productionDict
    }

    updateGHP(){
        this.GHP = [
            "Tydzień",
            "Przewidywany Popyt",
            "Produkcja",
            "Dostępne",
            {
                "Czas realizacji": this.czas_realizacji,
                "Na stanie":this.na_stanie
            }
        ]
    }

    isItCellFromRow(key, rowId) {
        return  key.split("-")[1] === rowId.toString()
    }

    isItCellFromCol(key, colId) {
        return key.split("-")[0] === colId.toString()
    }

    GHP = [
        "tydzień: ",
        "Przewidywany Popyt",
        "Produkcja",
        "Dostępne",
        {
            "Czas realizacji": this.czas_realizacji,
            "Na stanie":this.na_stanie
        }
    ]
    
    Podstawa = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 100,
            "Poziom BOM" : 1,
            "Na stanie" : 0
        }
    ]

    Gora = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 100,
            "Poziom BOM" : 1,
            "Na stanie" : 10
        }
    ]

    Filar = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 1,
            "Wielkość partii" : 400,
            "Poziom BOM" : 2,
            "Na stanie" : 10
        }
    ]

    Noga = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 1,
            "Wielkość partii" : 200,
            "Poziom BOM" : 2,
            "Na stanie" : 10
        }
    ]

    Podloga = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 150,
            "Poziom BOM" : 1,
            "Na stanie" : 10
        }
    ]

    Dach = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 150,
            "Poziom BOM" : 2,
            "Na stanie" : 0
        }
    ]

    Haczyk = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 1,
            "Wielkość partii" : 500,
            "Poziom BOM" : 2,
            "Na stanie" : 10
        }
    ]


    Default = [
        "Okres <br> Dane Produkcyjne",
        "Całkowite zapotrzebowanie",
        "Planowane przyjęcia",
        "Przewidywane na stanie",
        "Zapotrzebowanie netto",
        "Planowane zamówienia",
        "Planowane przyjęcie zamówień",
        {
            "Czas realizacji" : 2,
            "Wielkość partii" : 100,
            "Poziom BOM" : 1,
            "Na stanie" : 10
        }
    ]
}

function addElement(parent, type){
    var element = document.createElement(type)
    parent.appendChild(element)
    return element
}
function addElementAfter(parent, type){
    var element = document.createElement(type)
    parent.append(element)
    return element
}