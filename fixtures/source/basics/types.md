Tipi
====

I computer sono sofisticati e possono fare uso di variabili più
complesse di semplici numeri, ovvero possono essere di **tipi**
differenti. I tipi più comuni sono:

-   **Numeri**
    -   **Float (virgola mobile)**: 1.21323, 4, -33.5, 100004 oppure
        0.123
    -   **Integer (interi)**: 1, 12, -33, 140 ma non 1.233
-   **Stringhe**: come "elefante", "acqua", oppure "caspita sei alto!"

-   **Booleani**: possono essere **1** (vero) o **0** (falso) ma non di
    più. Vedremo che tutti gli operatori di confronto ritornano
    *booleani*.

-   **Array**: una sequenza di numeri 1,2,3,4,... o altri tipi

-   **Strutture dati**: rappresentano un oggetto complessi

In Octave non devi esplicitamente dichiarare il tipo di una variabile.
Devi semplicemente specificare durante l'assegnamento qual è il valore
che variabile deve avere; l'interprete deciderà automaticamente che tipo
assegnare quella variabile.

------------------------------------------------------------------------

Fare in modo che ad `a` venga assegnato un intero

``` matlab
a=
```

``` matlab
a=1;
```

``` matlab
isInteger(a)
```

------------------------------------------------------------------------
