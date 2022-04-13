# mrp

Strona internetowa hostująca obecny stan implementacji:

https://ego6ua.github.io/mrp-task/ 

W ramach projektu przygotowujemy algorytm MRP dla === przykładowego przedsiębiorstwa produkującego dronów.

Projekt zostanie wykonany w technologiach webowych (HTML CSS JAVASCRIPT)

Wstępnym źródłem informacji dla algorytmu MRP jest GHP (Główny Harmonogram Produkcji), struktura produktu oraz stan zapasów
Całkowite zapotrzebowanie pochodzi z GHP.

Struktura

DRON -->
1x KORPUS (1x BATERIA; 1x JEDNOSTKA STERUJĄCA; 4x ŚMIGŁO)
1x GŁOWA DRONA (1x MIKROFON; 2x KAMERA)

W ramach GHP znajdujemy zapotrzebowanie brutto pozycji z poziomu 0.

Procedura MRP obejmuje ustalenie czasu rozpoczęcia produkcji tak, aby materiały zostały dostarczone w odpowiednim czasie.
Zapotrzebowanie netto na materiały określonego poziomu zostaje przekstałcone na zapotrzebowanie brutto poziomu następnego, wśród połączonych ze sobą etapów. 

Praca studentów 1stopnia Informatyka Stosowana UEK:
Ivan Kudybyn 215565
Volodymyr Tymchyshyn 215734