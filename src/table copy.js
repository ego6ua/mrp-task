class table{
    constructor(parent, width, height){
        this.parent = parent
        this.width = width
        this.height = height
        var parentElement = document.getElementById(parent)
        parentElement.innerHTML = "test"
    }

}

class row{
    constructor(parent, width, height){
        this.parent = parent
        this.width = width
        this.height = height
        var parentElement = document.getElementById(parent)
        parentElement.innerHTML = "test"
    }

}

class block{
    constructor(width, height){
        this.parent = ""
        this.width = width
        this.height = height

    }

    createElement(parent){
        this.htmlElement = document.createElement("div")
        parent.appendChild(this.htmlElement)
    }

}