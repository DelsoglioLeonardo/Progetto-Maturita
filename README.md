# Progetto Maturità

Questo repository contiene il progetto di maturità, sviluppato da **Delsoglio Leonardo**, **Fissore Simone** e **Scoffone Cristian**. Il nostro obiettivo è sfruttare i robot presenti nel laboratorio di robotica della scuola per realizzare applicazioni avanzate. Il progetto è suddiviso in più fasi, ciascuna con un obiettivo specifico.

---

## 🔹 **Fase 1 - Comunicazione tra Robot e PLC** (Stato: **In corso** ✅)

Attualmente, stiamo lavorando per stabilire la comunicazione tra il robot **KUKA** e un **PLC**.  
Il problema principale è che il PC del KUKA dispone solo di **8 bit liberi** per la comunicazione, mentre il PLC utilizza un numero maggiore di bit. Per superare questa limitazione, stiamo sviluppando un **protocollo di comunicazione personalizzato** che permetta la corretta trasmissione e interpretazione dei dati tra i due dispositivi.

### 🔧 Passaggi della comunicazione:

1. **Definizione degli handshake** → Abbiamo identificato i comandi necessari per avviare il robot da remoto e scritto il protocollo di handshake.  
2. **Configurazione del lato fisico** → Abbiamo portato la **24V** al PLC.  
3. **Attivazione degli output del PLC** → Creazione di un ponticello per fornire la **24V** agli output del PLC.  
4. **Collegamento degli 8 bit** → Abbiamo connesso gli **8 bit del PLC** agli **8 bit liberi del PC del KUKA** per consentire lo scambio dati.  

Questa fase è fondamentale per rendere il robot pienamente operativo all'interno del nostro sistema.

---

## 🔜 **Fasi Future**  

Una volta completata la comunicazione tra il KUKA e il PLC, passeremo ad altre fasi del progetto. Alcune idee per i prossimi passi includono:

- **Fase 2** - Programmazione avanzata dei movimenti del KUKA.  
- **Fase 3** - Integrazione con gli altri robot presenti nel laboratorio.  
- **Fase 4** - Automazione di un processo specifico (da definire).  

📌 Il README verrà aggiornato con i progressi del progetto!

---

## 👥 Team di sviluppo  

- **Delsoglio Leonardo**  
- **Fissore Simone**  
- **Scoffone Cristian**  
