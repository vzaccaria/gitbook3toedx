Le basi della programmazione
============================

In questo primo capitolo impareremo le basi della programmazione in
Octave.

Programmare significa scrivere; proprio come un libro è fatto da
capitoli, paragrafi, frasi, parole e lettere, in maniera simile un
programma può essere spezzato in componenti sempre più piccole.

Per il momento la più importante componente che guarderemo è lo
**statement**. Uno **statement** è analogo ad una frase in un libro. Da
solo infatti uno statement non ha tanto significato; è solo all'interno
di un contesto che assume un rilievo importante.

Lo statement è anche comunemente conosciuto come **linea di codice**;
questo è perché gli statement tendono a essere scritti in sequenza su
linee individuali all'interno di un file testuale (chiamato **codice
sorgente**, o programma).

Una linea di codice è quindi una linea del tuo programma.

Ecco il primo esempio di programma Octave che andremo ad esaminare (solo
due righe di codice!):

``` matlab
1+1
2+2
```

Questo programma deve essere letto dall'interprete Octave che esegue,
linea per linea, le istruzioni che gli abbiamo dato. Abbiamo due
modalità per far questo:

1.  Invocare l'interprete (le modalità cambiano a seconda del sistema
    che state utilizzando, e.g. Windows, Linux, OSX) e digitare
    interattivamente il programma:

    ``` matlab
    octave:1> 1+1 «INVIO»
    ans =  2
    octave:2> 2+2 «INVIO»
    ans =  4
    octave:3>
    ```

2.  Scrivere le istruzioni in un file di testo (ad. es., `esempio.m`) ed
    eseguirlo con l'interprete (anche qui le modalità cambiano a seconda
    del sistema che state utilizzando). Otterrete in uscita la stampa a
    video seguente:

    ``` matlab
    ans =  2
    ans =  4
    ```

In questo corso preferiamo usare la seconda modalità (anche per gli
esercizi che dovrete risolvere), ma in alcuni casi faremo riferimento
anche alla prima.
