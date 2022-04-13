class table{
    constructor(parent, xSize, ySize, name = "default", schema = [], mrpElement){
        this.parent = parent
        this.xSize = xSize
        this.ySize = ySize
        this.name = name
        this.schema = schema
        this.content = {}
        this.title = Element(parent,"p")
        this.title.innerText = name
        this.title.classList.add("title")
        this.mrpElement = mrpElement
        this.initTable()
        
    }

    initTable(){
        var hilariousState = this
        this.table = Element(this.parent,"table")
        for (let i = 0; i<this.ySize; i++){
            var row = Element(this.table, "tr")
            for (let j = 0; j<this.xSize; j++){
                var cell = Element(row, "td")
                cell.classList.add("mrpTable");
                var inputField = document.createElement("div")
                var mrpReference = this.mrpElement
                inputField = document.createElement("input")
                inputField.classList.add("input_table")
                inputField.id = "IP"+ "#" + j + "-" + i
                console.log("crdwark", i)
                
                cell.appendChild(inputField)
                console.log(this.schema.length)
                if (i == 0){
                    cell.innerHTML = j
                    cell.classList.add("table_header")
                }
                if (j == 0){
                    cell.classList.add("table_header")
                }
                if (this.schema.length >= i && j == 0){
                    cell.innerHTML = this.schema[i]
                }
                
                cell.id = this.name + "#" + j + "-" + i
                
                this.content[j+"-"+i] = {
                    "element":cell, 
                    "type":this.schema[i], 
                    "id": j+"-"+i, "x" : j, 
                    "y" : i, 
                    "value": 0, 
                    "parent":this, 
                    "inputField":inputField,
                    "writeValue": function(value){
                        console.log("==========\nTo Cell: ",this, "write value type:",this.inputField.type); 
                        if (this.inputField.type == "text"){
                            this.inputField.value = value; 
                        }else{
                            this.element.innerHTML = value;
                        }
                        this.value = value; 
                        console.log("Updated cell:",this, "==========\n")}
                    }
                this.content[j+"-"+i].inputField.addEventListener("input", function(eventState, hilarious = hilariousState){
                    
                    if (this.value == "" || this.value == "-" || this.value == " "){
                        console.log("pass")
                    }else{
                        hilarious.content[this.id.split("#")[1]].writeValue(parseInt(this.value))
                    }
                    
                    
                    //table.up
                })
                this.content[j+"-"+i].inputField.addEventListener("change", function(eventState, hilarious = hilariousState){
                    if (this.value == "" || this.value == "-" || this.value == " "){
                        hilarious.content[this.id.split("#")[1]].writeValue("0")
                    }
                    
                    
                    
                    //table.up
                })
                if (i == 2 || i == 1){
                    inputField.addEventListener("input", function(ev, reference = mrpReference){
                        console.log("drdwark")
                        reference.loop()
                    })
                    
                }
                
            }
        }
        var mapList = {
            "Na stanie": "na_stanie",
            "Wielkość partii": "wlk_partii",
            "Czas Realizacji": "czas_realizacji"
        }
        var mrpReference = this.mrpElement
        for(var key in this.schema[this.schema.length-1]) {
            var value = this.schema[this.schema.length-1][key]
            this.description = Element(this.parent, "div")
            var description_text = Element(this.description, "label")
            description_text.setAttribute("type", "text")
            description_text.innerHTML = key
            description_text.classList.add("mrpDescription_text")
            var description_input = Element(this.description, "input")
            var uuname = this.name
            description_input.setAttribute("type", "number")
            description_input.setAttribute("value", value)
            description_input.addEventListener("input", function (event, reference = mrpReference, labelKey = localKey, uname = uuname) {
                console.log(reference)
                
                var key = mapList[labelKey]
                console.log(key)
                
                if (uname == "GHP"){
                    reference[key] = parseInt(this.value)
                    reference[uname][4][labelKey] = parseInt(this.value)
                }else{
                    reference[uname][7][labelKey] = parseInt(this.value)
                }
                
                console.log("ardwark",reference[key])
                reference.loop()
            })
            description_input.classList.add("mrpDescription_input")
            this.description.classList.add("mrpDescription")
        }
    }

    accessValue(id){
        return this.content[id].value
        
    }

    writeValue(id, value){
        this.content[id].value = value
        this.content[id].element.innerHTML = value
    }

    nextX(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = (parseInt(coors[0])+1).toString()+"-"+coors[1]
        this.verifyID(ret.split("-"))
        return ret
    }
    nextY(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = coors[0] +"-"+ (parseInt(coors[1])+1).toString()
        this.verifyID(ret.split("-"))
        return ret
    }

    prevX(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = (parseInt(coors[0])-1).toString()+"-"+coors[1]
        this.verifyID(ret.split("-"))
        return ret
    }
    prevY(id){
        let coors = id.split("-")
        this.verifyID(coors)
        let ret = coors[0] +"-"+ (parseInt(coors[1])-1).toString()
        this.verifyID(ret.split("-"))
        return ret
    }

    verifyID(id){
        if (parseInt(id[0])<0 || id[1]<0|| parseInt(id[0])>this.xSize-1 || parseInt(id[1])<0 || parseInt(id[1])>this.ySize-1 || id[0] == "" || id[1] == "" ||id[0] == "-" || id[1] == "-"){
            throw 'Invalid ID; ID out of scope';
        }else{
            return 0
        }
    }
    
}

function Element(parent, type){
    var element = document.createElement(type)
    parent.appendChild(element)
    return element
}


