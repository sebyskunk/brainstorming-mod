import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

// Lo switch: acceso = il prossimo prompt viene riformulato, non eseguito.
const isOn = atom({ plugin: 'brainstorming', key: 'isOn' } as const, false)
// Vero durante il turno che sta riformulando un prompt.
const isRewriting = atom({ plugin: 'brainstorming', key: 'isRewriting' } as const, false)

const PANE = 'brainstorming'

const INSTRUCTION = [
  'MODALITÀ BRAINSTORMING ATTIVA (scelta dall\'utente con lo switch "Brainstorming").',
  'Il messaggio dell\'utente qui sopra è un flusso di pensiero dettato a voce: può contenere errori grammaticali, ripetizioni, frasi spezzate e nessuna formattazione.',
  'NON eseguire la richiesta e NON usare alcuno strumento.',
  'Riscrivila invece come un prompt chiaro, strutturato e organizzato, nella stessa lingua dell\'utente:',
  '- un titolo breve con l\'obiettivo;',
  '- il contesto;',
  '- i requisiti e i vincoli come elenco puntato, raggruppati per tema;',
  '- cosa conta come risultato finito;',
  '- le domande aperte o i punti ambigui, se ce ne sono.',
  'Correggi la grammatica, elimina le ripetizioni, mantieni ogni idea e dettaglio dell\'utente senza aggiungerne di inventati.',
  'Rispondi solo con il prompt riformulato in un blocco di testo, poi una riga finale che dica che l\'utente può copiarlo, modificarlo e inviarlo per farlo eseguire.',
].join('\n')

// Il widget nella colonna laterale dell'app (la "session rail").
function open($: EngineInterface) {
  return $.ui.open({ id: PANE, title: 'Brainstorming', placement: 'widget' })
}

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    const isPersonTyping = e.origin.kind === 'composer' || e.origin.kind === 'bridge'
    if (e.command || e.isMeta || !isPersonTyping || !(await read($, isOn))) {
      return next(e)
    }

    // Vale per un solo prompt: lo switch si spegne da solo.
    await update($, isOn, () => false)
    await update($, isRewriting, () => true)
    $.ui.toast('Brainstorming: riformulo il prompt senza eseguirlo')

    return next({ ...e, context: [...(e.context ?? []), INSTRUCTION] })
  }).catch(($, e, next) => next(e))

  // Durante la riformulazione nessuno strumento parte.
  on('tool.call', async ($, e, next) =>
    (await read($, isRewriting))
      ? { deny: 'Brainstorming: in questo turno riformulo soltanto il prompt, senza eseguire nulla.' }
      : next(e),
  ).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    await update($, isRewriting, () => false)
    return next(e)
  })

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'brainstorming',
      description: 'Riapre lo switch Brainstorming nella colonna laterale',
    })
    void open($)

    return next(e)
  })

  on('command.run', { command: 'brainstorming' }, async $ => {
    await open($)

    return { text: 'Switch Brainstorming aperto.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const isOnNow = await read($, isOn)
    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row" gap={1} alignItems="center">
        <Text bold>Brainstorming</Text>
        <Button
          key="switch"
          hotkey="b"
          variant={isOnNow ? 'primary' : undefined}
          onPress={() => update($, isOn, v => !v)}
        >
          {isOnNow ? '● ON' : '○ OFF'}
        </Button>
      </Box>
    )
  })
}
