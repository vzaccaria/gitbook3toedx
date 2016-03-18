Stampa a video
==============

Le stringhe, cosí come ogni altra variabile Octave possono essere
stampate a video durante l'esecuzione del programma.

Ogni qual volta assegnate un valore ad una variabile, senza terminare il
comando con un punto e virgola (`;`), questo provoca la visualizzazione
del risultato direttamente a video.

Se apriamo l'interprete Octave e digitiamo («INVIO» significa
schiacciare il tasto invio):

``` matlab
octave> x = 10 «INVIO»
```

otterremo:

``` matlab
x = 10
```

Se invece usiamo il `;`:

``` matlab
octave> y = 11; «INVIO»
```

non verrà stampato nulla.

La funzione `disp`
------------------

Ricordarsi di mettere o non mettere i punti e virgola puo' diventare
noioso. In più, come faremo più avanti nel corso, non ci è permessa
molta libertà nel decidere cosa stampare.

Abbiamo quindi bisogno di un modo più esplicito per stampare le
variabili. A questo serve la funzione `disp`; vediamo un esempio:

``` matlab
x = 100
disp('Il valore di x: ')
disp(x)
```

Se eseguite il codice sopra in octave otterrete

    Il valore di x:
    100
