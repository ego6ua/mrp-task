class form {
    constructor(create=true){
        if(create == true) {
            this.title = "form"
            var parentElement = document.getElementById("main")
            var contentBox = document.createElement('div')
            contentBox.id = this.title + ".contentBox"
            contentBox.classList.add("contentBox")

            contentBox.innerHTML = 
            `<form action="" method="get" id="mrp">
                <h2 class="form_h2">Przewidywany popyt</h2>
                <table id="popyt" class="formTable center">
                </table>
                <h2 class="form_h2">Dane produkcyjne</h2>
                <table class="formTable center">
                    <tr>
                        <td><label class="form_label" for="GHP.na_stanie">Na stanie: </label></td>
                        <td><input class="form_input" type="number" id="GHP.na_stanie" name="GHP.na_stanie" value="0"></td>
                    </tr>
                    <tr>
                        <td><label class="form_label" for="GHP.czas_realizacji">Czas realizacji: </label></td>
                        <td><input class="form_input" type="number" id="GHP.czas_realizacji" name="GHP.czas_realizacji" value="1"></td>
                    </tr>   
                </table>
                <button class="form_button center" type="submit">Pokaż tabele</button>
            </form>`;

            parentElement.appendChild(contentBox)

            this.popytId = 0;
            this.firstChanged = false;
            this.addTableRow()
        }
    }

    addTableRow(){
        this.popytId ++
        this.firstChanged = false
        var table = document.getElementById("popyt")
        var tr = document.createElement('tr')
        tr.innerHTML =
        `<td><label class="form_label" for="GHP.nr_tyg_`+this.popytId+`">Nr tygodnia: </label></td>
         <td><input class="form_input" type="number" id="GHP.nr_tyg_`+this.popytId+`" name="GHP.nr_tyg_`+this.popytId+`" value="0"></td>
         <td><label class="form_label" for="GHP.ilosc_karmnikow_`+this.popytId+`">Ilość karmników: </label></td>
         <td><input class="form_input" type="number" id="GHP.ilosc_karmnikow_`+this.popytId+`" name="GHP.ilosc_karmnikow_`+this.popytId+`" value="0"></td>`
        table.appendChild(tr)
        document.getElementById("GHP.nr_tyg_"+ this.popytId).addEventListener("change", () => {
            this.firstChanged = true
        });
        document.getElementById("GHP.ilosc_karmnikow_"+ this.popytId).addEventListener("change", () => {
            if(this.firstChanged == true) this.addTableRow();
        });
    }       
}