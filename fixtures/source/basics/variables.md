Variabili
=========

Il primo passo per poter comprendere realmente la programmazione è
considerare l'analogia con l'algebra che studiavi a scuola. L'algebra
descrive delle espressioni:

    3 + 5 = 8

Se ti ricordi, le espressioni potevano contenere incognite, per esempio
`x`:

    3 + x = 8

Potevi determinare il valore della variabile `x` spostando i termini
intorno all'equazione:

    x = 8 - 3
    -> x = 5

`x` è di fatto un contenitore che contiene il valore 5.

Cosa è effettivamente una variabile
-----------------------------------

Proprio come nell'algebra, le variabili di cui si parla in informatica
sono **contenitori** per valori.

Questi contenitori sono posti nella memoria del calcolatore. In
generale, potete modificare il contenuto di tali contenitori diverse
volte durante l'esecuzione del vostro programma; l'unica cosa importante
da ricordare è che quando il calcolatore viene spento, le variabili
perdono il loro valore.

Le variabili hanno un **nome** ed un **valore**; i nomi possono essere
qualsiasi lettera o parola ma ricorda che ci sono delle restrizioni che
variano da linguaggio e linguaggio.

Come definire una variabile in Octave
------------------------------------

Quest programma Octave mostra come assegnare un valore ai contenitori
`x` ed `y`, calcolarne la somma ed inserirla nel contenitore `result`:

``` matlab
x = 5;
y = 6;
result = x + y;
```

Nota bene: il valore corrente di una variabile è sempre l'ultimo che le
è stato assegnato:

------------------------------------------------------------------------

Supponete di avere il seguente programma:

-   `x = 1;`
-   `x = 3;`
-   `y = 6;`
-   `result = x + y;`

Quale sarà il valore finale di `result`?

``` quiz
7
Indeterminato
9
```

``` quiz
9
```

``` quiz
result = 3 + 6
```
