# mrp

Strona internetowa hostująca obecny stan implementacji:

http://v-ie.uek.krakow.pl/~s215676/mrp/

W ramach projektu przygotowujemy algorytm MRP dla przykładowego przedsiębiorstwa produkującego karmniki dla ptaków.

Projekt zostanie wykonany w technologiach webowych (HTML CSS JAVASCRIPT)

Wstępnym źródłem informacji dla algorytmu MRP jest GHP (Główny Harmonogram Produkcji), struktura produktu oraz stan zapasów
Całkowite zapotrzebowanie pochodzi z GHP.

![diagram drawio](https://user-images.githubusercontent.com/38815170/161923911-6de0c371-a428-4ecb-bb66-5f1bff18940a.png)


Struktura karmnika jest podzielona na dwie główne części, podstawę i górną część.

W skład podstawy wchodzą elementy, takie jak: filary (utrzymujące dach karmnika), noga (część, na której stoi cały karmnik) i podłoga (będąca podstawą karmnika, na której siadać będą ptaki).

Górna część zawiera dach oraz haczyki (na których zawieszane będą pojemniki z jedzeniem dla zwierząt).

W ramach GHP znajdujemy zapotrzebowanie brutto pozycji z poziomu 0.

Procedura MRP obejmuje ustalenie czasu rozpoczęcia produkcji tak, aby materiały zostały dostarczone w odpowiednim czasie.
Zapotrzebowanie netto na materiały określonego poziomu zostaje przekstałcone na zapotrzebowanie brutto poziomu następnego, wśród połączonych ze sobą etapów. 

Przykładowe przejście przez proces zostało zobrazowane na poniższych tabelach (w przykładzie następuje, popyt na 80 jednostek w 5 tygodniu oraz 30 jednostek w 7 tygodniu, z założeniem braku zapasu ukończonych karmników na stanie):

|***GHP***|||||||||||
| - | - | - | - | - | - | - | - | - | - | - |
|***tydzień:***|***1***|***2***|***3***|***4***|***5***|***6***|***7***|***8***|***9***|***10***|
|***Przewidywany popyt***|||||***80***||***30***||||
|***Produkcja***|||||***100***|***0***|***100***||||
|***Dostępne***|***0***|***0***|***0***|***0***|***20***|***20***|***90***||||
|***Czas realizacji = 1  Na stanie = 0***|||||||||||
|||||||||||||
|***Podstawa (założenie: wielkość partii 100)***|||||||||
|***Okres  Dane produkcyjne***|***1***|***2***|***3***|***4***|***5***|***6***|||||
|***Całkowite zapotrzebowanie***||||***100***||***100***|||||
|***Planowane przyjęcia***|||||||||||
|***Przewidywane na stanie***|***0***|***0***|***0***|***0***|***0***|***0***|||||
|***Zapotrzebowanie netto***||||***100***||***100***|||||
|***Planowane zamówienia***||***100***||***100***|||||||
|***Planowane przyjęcie zamówień***||||***100***||***100***|||||
|***Czas realizacji = 2  Wielkość partii = 100  Poziom BOM = 1  Na stanie = 0***||||||
||||||||||||
||||||||||||
|***Góra (założenie: wielkość partii 100)***||||||||||
|**Okres  Dane produkcyjne**|***1***|***2***|***3***|***4***|***5***|***6***|||||
|**Całkowite zapotrzebowanie**||||***100***||***100***|||||
|**Planowane przyjęcia**|||||||||||
|**Przewidywane na stanie**|***0***|***0***|***0***|***0***|***0***|***0***|||||
|**Zapotrzebowanie netto**||||***100***||***100***|||||
|**Planowane zamówienia**||***100***||***100***|||||||
|**Planowane przyjęcie zamówień**||||***100***||***100***|||||
|**Czas realizacji = 2  Wielkość partii = 100  Poziom BOM = 1  Na stanie = 0**||||||
||||||||||||
||||||||||||
||||||||||||


|***Filary (założenie: wielkość partii 400)***||||||||||
| - | - | - | - | - | - | - | - | - | - |
|***Okres  Dane produkcyjne***|***1***|***2***|***3***|***4***|***5***|***6***|||||
|***Całkowite zapotrzebowanie***||***400***||***400***|||||||
|***Planowane przyjęcia***|||||||||||
|***Przewidywane na stanie***|***200***|***0***|***200***|***0***|***200***|***200***|||||
|***Zapotrzebowanie netto***||***200***||***200***|||||||
|***Planowane zamówienia***|***400***||***400***||||||||
|***Planowane przyjęcie zamówień***||***400***||***400***|||||||
|***Czas realizacji = 1  Wielkość partii = 400  Poziom BOM = 2  Na stanie = 200***||||||
||||||||||||
||||||||||||
|***Noga (założenie: wielkość partii 200)***||||||||||
|**Okres  Dane produkcyjne**|**1**|**2**|**3**|**4**|**5**|**6**|||||
|**Całkowite zapotrzebowanie**||***100***||***100***|||||||
|**Planowane przyjęcia**|||||||||||
|**Przewidywane na stanie**|***0***|***0***|***100***|***0***|***0***|***0***|||||
|**Zapotrzebowanie netto**||***100***|||||||||
|**Planowane zamówienia**|***200***||||||||||
|**Planowane przyjęcie zamówień**||***200***|||||||||
|**Czas realizacji = 1  Wielkość partii = 200  Poziom BOM = 2  Na stanie = 0**||||||
||||||||||||
||||||||||||
|**Podłogi (założenie: wielkość partii 150)**|||||||||
|**Okres  Dane produkcyjne**|**1**|**2**|**3**|**4**|**5**|**6**|||||
|**Całkowite zapotrzebowanie**||***100***||***100***|||||||
|**Planowane przyjęcia**||***100***|||||||||
|**Przewidywane na stanie**|***0***|***0***|***0***|***-100***|***50***|***50***|||||
|**Zapotrzebowanie netto**||||***100***|||||||
|**Planowane zamówienia**||***150***|||||||||
|**Planowane przyjęcie zamówień**||||***150***|||||||
|**Czas realizacji = 2  Wielkość partii = 150  Poziom BOM = 2  Na stanie = 0**||||||


||||||||||||
| - | - | - | - | - | - | - | - | - | - | - |
||||||||||||
|***Dachy (założenie: wielkość partii 150)***||||||||||
|**Okres  Dane produkcyjne**|**1**|**2**|**3**|**4**|**5**|**6**|||||
|**Całkowite zapotrzebowanie**||***100***||***100***|||||||
|**Planowane przyjęcia**||***100***|||||||||
|**Przewidywane na stanie**||***0***|***0***|***0***|***50***|***50***|||||
|**Zapotrzebowanie netto**||||***100***|||||||
|**Planowane zamówienia**||***150***|||||||||
|**Planowane przyjęcie zamówień**||||***150***|||||||
|**Czas realizacji = 2  Wielkość partii = 150  Poziom BOM = 2  Na stanie = 0**||||||
||||||||||||
||||||||||||
|**Haczyki (założenie: wielkość partii 500)**|||||||||
|**Okres  Dane produkcyjne**|**1**|**2**|**3**|**4**|**5**|**6**|||||
|**Całkowite zapotrzebowanie**||***200***||***200***|||||||
|**Planowane przyjęcia**|||||||||||
|**Przewidywane na stanie**||***300***|***300***|***300***|***100***|***100***|||||
|**Zapotrzebowanie netto**||***200***|||||||||
|**Planowane zamówienia**|***500***||||||||||
|**Planowane przyjęcie zamówień**||***500***|||||||||
|**Czas realizacji = 1  Wielkość partii = 500  Poziom BOM = 2  Na stanie = 0**||||||


