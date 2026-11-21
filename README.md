# Brainstorming

Una mod per Claude Code che aggiunge lo switch **Brainstorming** nella colonna laterale dell'app.

Quando lo switch è acceso, Claude non esegue il prossimo messaggio. Lo riscrive invece come un prompt chiaro e organizzato: titolo, contesto, requisiti raggruppati per tema, risultato atteso e domande aperte. È pensata per i messaggi lunghi dettati a voce, pieni di ripetizioni e senza formattazione. Durante quel turno nessuno strumento viene eseguito, e lo switch si spegne da solo dopo un prompt. Copi il testo riformulato, lo sistemi e lo rimandi per farlo eseguire.

Se chiudi il widget, lo riapri con `/brainstorming`.

## Installazione

Al prompt di una sessione di Claude Code nel terminale:

```
/plugin install brainstorming --marketplace sebyskunk/brainstorming-mod
```

Rispondi `y` per aggiungere il marketplace, poi premi Invio per scegliere lo scope.

Dalla shell:

```bash
claude plugin install brainstorming --marketplace sebyskunk/brainstorming-mod
```

Nell'app desktop, dove `/plugin` non funziona: clicca + accanto al campo del prompt, poi Plugins, Add marketplace con `sebyskunk/brainstorming-mod`, poi Add plugin.

## Licenza

MIT
