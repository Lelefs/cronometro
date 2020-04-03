import React, { useState, useEffect } from 'react';
import './styles.scss';
import beeponce from '../../assets/music/beeponce.mp3';
import voyagermessage from '../../assets/music/voyagermessage.mp3';
import { FiMenu, FiPlay, FiSquare, FiPause } from 'react-icons/fi';

export default function Main() {

    const [ativo, setAtivo] = useState(false);
    const [exercicios, setExercicios] = useState(0);
    const [exerciciosPorSerie, setExerciciosPorSerie] = useState(3);
    const [repeticoes, setRepeticoes] = useState(0);
    const [series, setSeries] = useState(5);
    const [tempo, setTempo] = useState(0);
    const [tempoDescanso, setTempoDescanso] = useState(10);
    const [tempoExercicio, setTempoExercicio] = useState(25);
    const [tempoPreparacao, setTempoPreparacao] = useState(3);
    const [descricao, setDescricao] = useState('Vamos começar');
    const [estado, setEstado] = useState('Parado');
    const [mostrarOuNao, setMostrarOuNao] = useState('esconder');
    let audioPreparar = new Audio(beeponce);
    let audioComecar = new Audio(voyagermessage);

    useEffect(() => {
        let interval = null;

        if (ativo) {

            interval = setInterval(() => {
                switch (descricao) {

                    case 'Prepare-se':
                        pausarAudio('audioComecar');
                        if (tempo === parseInt(tempoPreparacao)) {
                            iniciarAudio('audioPreparar');
                            setTempo(0);
                            setDescricao('VALENDOOOOO!');
                            setExercicios(exercicios + 1);
                        } else {
                            setTempo(tempo + 1);
                        }
                        break;
                
                    default:
                        break;

                    case 'VALENDOOOOO!':
                        pausarAudio('audioPreparar');
                        if (tempo === parseInt(tempoExercicio)) {
                            iniciarAudio('audioComecar');
                            setTempo(0);

                            if (exercicios === parseInt(exerciciosPorSerie)) {
                                setExercicios(0);
                                setRepeticoes(repeticoes + 1);
                                setDescricao('Descanse');
                            } else {
                                setDescricao('Prepare-se');
                            }

                        } else {
                            setTempo(tempo + 1);
                        }
                        break;

                    case 'Descanse':
                        if (repeticoes === parseInt(series)) {
                            setEstado('Parado');
                            setDescricao('PARABÉNS! TREINO CONCLUÍDO');
                            setAtivo(false);
                            setTempo(0);
                        } else {
                            if (tempo === parseInt(tempoDescanso)) {
                                setTempo(0);
                                setDescricao('Prepare-se');
                            } else {
                                setTempo(tempo + 1);
                            }
                        }
                        break;

                }
            }, 1000);
            
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    // eslint-disable-next-line
    }, [ativo, tempo]);

    function iniciarAudio (audio) {
        console.log('iniciar audio:', audio);
        
        audio === 'audioComecar' ? audioComecar.play() : audioPreparar.play();
    };

    function pausarAudio (audio) {
        audio === 'audioComecar' ? audioComecar.pause() : audioPreparar.pause();
    };

    function iniciarCronometro() {
        if (!parseInt(tempoExercicio) > 0 || !parseInt(tempoDescanso) > 0 || !parseInt(tempoPreparacao) > 0 || !parseInt(exerciciosPorSerie) > 0 || !parseInt(series) > 0) {
            return;
        }
        setMostrarOuNao('esconder');
        setDescricao('Prepare-se');
        setEstado('Rodando');
        setAtivo(true);
    };

    function pausarCronometro() {
        setEstado('Pausado');
        setAtivo(false);
    };

    function pararCronometro() {
        setEstado('Parado');
        setDescricao('Vamos começar');
        setAtivo(false);
        zerarTudo();
    };

    function zerarTudo() {
        setTempo(0);
        setExercicios(0);
        setRepeticoes(0);
    }

    function toggleMenu() {
        if (estado === 'Pausado' || ativo) {
            return;
        }
         if (mostrarOuNao === '') {
            setMostrarOuNao('esconder');
         } else {
            setMostrarOuNao('');
            setTimeout(() => { document.getElementById('tempoExercicioInput').focus(); }, 400);
         }
    }

    return (
        <div className="App">
            <header className="App-header">
                { estado === 'Pausado' || ativo
                    ? <FiSquare size={25} color="#fff" onClick={ () => pararCronometro() } />
                    : <FiMenu size={25} color="#fff" onClick={() => toggleMenu()} />
                }

                <div className={`form ${mostrarOuNao}`}>
                    <div>
                        <label htmlFor="tempoExercicioInput">Tempo dos exercícios</label>
                        <input id="tempoExercicioInput" type="number" value={tempoExercicio} onChange={e => setTempoExercicio(e.target.value)} autoFocus />
                    </div>

                    <div>
                        <label htmlFor="tempoDescansoInput">Tempo de descanso</label>
                        <input id="tempoDescansoInput" type="number" value={tempoDescanso} onChange={e => setTempoDescanso(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="tempoPreparacaoInput">Tempo de preparação</label>
                        <input id="tempoPreparacaoInput" type="number" value={tempoPreparacao} onChange={e => setTempoPreparacao(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="exerciciosPorSerieInput">Exercícios por série</label>
                        <input id="exerciciosPorSerieInput" type="number" value={exerciciosPorSerie} onChange={e => setExerciciosPorSerie(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="seriesInput">Quantidade de séries</label>
                        <input id="seriesInput" type="number" value={series} onChange={e => setSeries(e.target.value)} />
                    </div>
                </div>

                { estado === 'Parado' || estado === 'Pausado' 
                    ? <FiPlay size={25} color="#fff" onClick={ () => iniciarCronometro() } /> 
                    : <FiPause size={25} color="#fff" onClick={ () => pausarCronometro() } /> 
                }

                <div className="divVazia"></div>
            </header>

            <div className="main-content">
                <h3>{ tempo < 10 ? `0${tempo}` : tempo }</h3>
                <p>{descricao}</p>
                <p>Séries concluídas: {repeticoes}</p>
            </div>
        </div>
    );

};