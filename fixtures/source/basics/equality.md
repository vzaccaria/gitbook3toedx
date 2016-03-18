Test di uguaglianza
===================

I programmatori devono frequentemente determinare se due variabili sono
uguali oppure no. Questo viene fatto attraverso un operatore di
uguaglianza.

L'operatore per determinare l'uguaglianza di variabili è `==`
(uguale-uguale). Il valore risultante può essere `1` (**vero**) o `0`
(**falso**) e, a sua volta, può essere inserito in un'altra variabile:

``` matlab
a = 1
b = 1
c = (a == b)
```

In questo caso il valore finale della variabile C è uguale a `1`.

Altri operatori relazionali
---------------------------

L'operatore `==` fa parte dell'insieme più ampio di **operatori
relazionali**, ovvero operatori che permettono di stabilire che
relazione hanno due numeri:

| Operatore | Significato             |
|-----------|-------------------------|
| `<`       | Minore di.              |
| `<=`      | Minore di o uguale a.   |
| `>`       | Maggiore di.            |
| `>=`      | Maggiori di o uguale a. |
| `==`      | Uguale a.               |
| `~=`      | Diverso da.             |

Ad esempio, l'operatore `<=` (minore uguale) è tale che il seguente
codice:

``` matlab
a = 3
b = 6
c = (a <= b)
```

assegni a `c` il valore 1.

------------------------------------------------------------------------

Esercizio: Se avessimo usato l'espressione `c = (a ~= b)`, quale sarebbe
stato il valore finale di `c`?

``` quiz
0
1
-1
```

``` quiz
1
```

``` quiz
L'operatore `~=` assegna a `c` il valore 1 solo se `a` e `b` sono diversi.
```
