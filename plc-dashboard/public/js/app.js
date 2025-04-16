$(document).ready(function() {
    // WebSocket per ricevere i dati in tempo reale dal server
    const ws = new WebSocket('ws://localhost:3000');
    const ctx = document.getElementById('plcDataChart').getContext('2d');
    
    let plcData = {
        labels: [],  // Etichette per il grafico
        byte1: [],   // Dati Byte1 per il grafico
        byte2: []    // Dati Byte2 per il grafico
    };

    // Configurazione del grafico con Chart.js
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: plcData.labels,
            datasets: [{
                label: 'Byte 1',
                data: plcData.byte1,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }, {
                label: 'Byte 2',
                data: plcData.byte2,
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false
            }]
        }
    });

    // Gestione del WebSocket per ricevere i dati dal PLC
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const time = new Date().toLocaleTimeString();  // Tempo corrente

        // Aggiungere i nuovi dati al grafico
        plcData.labels.push(time);
        plcData.byte1.push(data.byte1);
        plcData.byte2.push(data.byte2);

        // Limita il numero di punti nel grafico per evitare che cresca troppo
        if (plcData.labels.length > 20) {
            plcData.labels.shift();
            plcData.byte1.shift();
            plcData.byte2.shift();
        }

        chart.update();  // Aggiorna il grafico con i nuovi dati
    };

    // Invia il numero del programma selezionato al PLC
    $('#sendProgram').click(function() {
        const programNumber = $('#programNumber').val();
        $.ajax({
            url: '/plc/program',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ programNumber }),
            success: function() {
                alert('Programma inviato correttamente');
            },
            error: function() {
                alert('Errore nell\'invio del programma');
            }
        });
    });

    // Avvia il robot
    $('#startRobot').click(function() {
        $.post('/plc/start', function() {
            alert('Robot avviato');
        });
    });

    // Ferma il robot
    $('#stopRobot').click(function() {
        $.post('/plc/stop', function() {
            alert('Robot fermato');
        });
    });
});
