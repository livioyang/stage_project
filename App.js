import React, { useState, useEffect, useRef } from 'react';
import { NavBar,ImportStyle } from './functions';
import { getCategoryFromGensIds } from './functions'
import {BiHeart} from 'react-icons/bi'
import {MdHeartBroken} from 'react-icons/md'
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);//immagine
  const [type, setType] = useState('');//tipo film o serie
  const [data, setData] = useState([]);//array
  const [searchQuery, setSearchQuery] = useState('');//input search
  const [currentPage, setCurrentPage] = useState(1);//stato pagina
  const [isModalOpen, setIsModalOpen] = useState(false); //  stato per il modal
  const itemsPerPage = 20; //num di items per pagina max=40
  const selectedImageRef = useRef(null); //riferimento del imm
  const [dataPreferiti,setDataPreferiti]=useState([])//array preferiti
  const [isClickedPreferito,seTisClickedPreferito]=useState(false) //per la paginazione dei preferiti
  const [maxPageFilm,setMaxPageFilm]=useState(0)
  const [maxPageSerie,setMaxPageSerie]=useState(0)
  const [searchIsClicked,setSearchIsClicked]=useState(false) //per la paginazione della ricerca
  const [genre,setGenre]=useState([]) //per visualizzare il genere 
  
  const [searchData,setsearchData]=useState([])
  const [VotedData,setVotedData]=useState([])
  const [selectedValueLingua, setSelectedValueLingua] = useState('it');
  const { t } = useTranslation();

  const [msgNotFound,setmsgNotFound]=useState(false)

//richiesta dato dal backeand
 useEffect(() => {
     
  const fetchData = async () => {
  try {
    const LanguageAndPage={language:selectedValueLingua,
                           page:currentPage}
    const responseFilm = await axios.get('https://api.themoviedb.org/3/discover/movie?api_key=615792ad94b3cc4c4bd1598289bca684&language='+selectedValueLingua+'&page=' + currentPage,LanguageAndPage);
    const responseSerie = await axios.get('https://api.themoviedb.org/3/discover/tv?api_key=615792ad94b3cc4c4bd1598289bca684&language='+selectedValueLingua+'&page=' + currentPage,LanguageAndPage);

    changeMaxPage(responseFilm.data.total_pages,responseSerie.data.total_pages)
    const infoFilm = responseFilm.data.results;
    const infoSerie = responseSerie.data.results;

    const responseData = [];
    infoFilm.forEach((item, index) => {
      const backdrop_path=item.backdrop_path===null?'':'https://www.themoviedb.org/t/p/w500'+item.backdrop_path //per eliminare il tempo di attesa in caso di null
      const movie = {
          id: item.id,
          name: item.title,
          overview: item.overview,
          release_date: item.release_date,
          backdrop_path: backdrop_path,
          vote_average: item.vote_average,
          imgAlt: 'ImgFilm' + index,
          type: 'Film',
          isPreferito: false,
          vote_count:item.vote_count,
          votato:false,
          votoValue:0,
          genre_ids: item.genre_ids,
      };
       responseData.push(movie);

    });
  
    infoSerie.forEach((item, index) => {
      const backdrop_path=item.backdrop_path===null?'':'https://www.themoviedb.org/t/p/w500'+item.backdrop_path
      const serieTv = {
        id: item.id,
        name: item.name,
        overview: item.overview,
        release_date: item.first_air_date,
        backdrop_path: backdrop_path,
        vote_average: item.vote_average,
        imgAlt: 'ImgSerie' + index,
        genre_ids: item.genre_ids,
        isPreferito: false,
        vote_count:item.vote_count,
        votato:false,
        votoValue:0,
        type: 'Serie',
      };
      responseData.push(serieTv);
    });
    setData(responseData);
  } catch (error) {
    console.error(error);
  }
};

fetchData();
 }, [currentPage,type,selectedValueLingua]);

  //per chiudere il modal
  useEffect(() => {
    if (isModalOpen && selectedImage !== null) {
      document.addEventListener('click', handleOutsideClick);
      return () => {
//anulla il voto quando chiude il modal
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [isModalOpen, selectedImage]);

  // prelievo preferiti dal local storage
  useEffect(() => {
    if (initialControllLocalStorage('preferiti')) {
      const preferitiData = window.localStorage.getItem("preferiti");
      try {
        
        const parsedData = JSON.parse(preferitiData);
        setDataPreferiti(parsedData);
      } catch (error) {
        console.error("Error parsing preferiti data:", error);
      }
    }
    //prelievo dei votati
    if (initialControllLocalStorage('votedData')) {
      const votedData = window.localStorage.getItem('votedData');
      try {
        const parsedData = JSON.parse(votedData);
        setVotedData(parsedData);
      } catch (error) {
        console.error('Error parsing votedData:', error);
      }
    }
  }, []);
//da modificare
 function fetchGenres(selectedImageData) {
   if ( selectedImageData&&selectedImageData.type){
    const tipo = selectedImageData.type==='Film'?'movie':'tv'//da eliminare
    axios.get('https://api.themoviedb.org/3/genre/'+tipo+'/list?language=en&Authorization=Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmVkNjdmYjlmYzU2MGU3OThiYWRmMTVmM2YxNmI0ZiIsInN1YiI6IjY0Nzg1YWZhMDc2Y2U4MDE0OWVkZGJmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ss2lshKf9y8s6bK1f9cuff5PYH17iiK46Dte0FZAx-c&api_key=615792ad94b3cc4c4bd1598289bca684')
   //da modificare in axios.post('',{selectedImageData.genre_ids:selectedImageData.genre_ids,type:selectedImageData.type}) 
      .then(response=>{
        const item = getCategoryFromGensIds(selectedImageData.genre_ids,response.data.genres)//da eliminare
        setGenre(item) //setGenre(response)
      })
      .catch(error=>console.log('FETCHGENS ERRORE',error))
  }
 }
 function changeMaxPage(pageF,pageS){
  setMaxPageFilm(pageF)
  setMaxPageSerie(pageS)
 }
 function controll_array(array){
  return Array.isArray(array)
 }
//se non viene cliccato nessun bottone appare sia film che serie, se viene cliccato preferiti appare preferiti
 function initialControll(){
    return isClickedPreferito ? dataPreferiti :  searchIsClicked? searchData : type==='' ? data : filterData();
 }
  //controllo se la localStorage è vuota
  function controll_changeIsPreferiti(){
    const filteredData=initialControll()
    if(initialControllLocalStorage('preferiti')&&controll_array(filteredData)){
      filteredData.forEach(item=>{
      if(dataPreferiti.some(element=>element.id===item.id))
        item.isPreferito=true;     
    }) 
  }
  }
  function initialControllLocalStorage(key){
    return window.localStorage.getItem(key) !== null;
  }
  function controllVoto(){
    const filteredData=initialControll()
    if(initialControllLocalStorage('votedData')&&controll_array(filteredData)){
      filteredData.forEach(item=>{
        if(VotedData.some(element=>element.id===item.id))
          item.votato=true
        else item.votato=false
        VotedData.forEach(element=>{if(element.id===item.id)item.votoValue=element.votoValue})//per aggiornare il votoValue correttamente
      })
    }
  }
  function changePagePreferito(){
    setmsgNotFound(false)
    seTisClickedPreferito(true)
    setSelectedImage(null);
    setSearchIsClicked(false)
    setCurrentPage(1);
  }
  function addPreferiti(item) {
    item.isPreferito=true
    // Verifica se l'oggetto è già presente nell'array dataPreferiti
    const isDuplicate = dataPreferiti.some((preferito) => preferito.id === item.id);
    if (isDuplicate)return
    const newDataPreferiti = [...dataPreferiti, item];
    setDataPreferiti(newDataPreferiti);
    window.localStorage.setItem("preferiti", JSON.stringify(newDataPreferiti));
  }
  function removePreferito(item){
    item.isPreferito=false
    const updatedDataPreferiti = dataPreferiti.filter((element) => element.id !== item.id);
    setDataPreferiti(updatedDataPreferiti);
    window.localStorage.setItem("preferiti", JSON.stringify(updatedDataPreferiti));
  }
  function changetypeFilm() {
    setmsgNotFound(false)
    setType('Film');
    setSearchIsClicked(false)
    setSelectedImage(null);
    setCurrentPage(1);
    seTisClickedPreferito(false)
  }
  function changeTypeSerie() {
    setmsgNotFound(false)
    setType('Serie');
    setSelectedImage(null);
    setSearchIsClicked(false)
    setCurrentPage(1);
    seTisClickedPreferito(false)

  }
  

  
  //search del backend se l'input di ricerca nn è vuota
  async function handleSearch(query) {
    setSearchIsClicked(true)
    setSearchQuery(query)
    seTisClickedPreferito(false)
    setSelectedImage(null)
    setType('')
    setCurrentPage(1);

    if (query.trim() !== '') {
      setmsgNotFound(false)
      try {
        const responseFilm = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=615792ad94b3cc4c4bd1598289bca684&query=${query}&language=${selectedValueLingua}`);
        const responseSerie = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=615792ad94b3cc4c4bd1598289bca684&query=${query}&language=${selectedValueLingua}`);

        if(responseFilm.data.total_results === 0 && responseSerie.data.total_results === 0) setmsgNotFound(true)

        else{

          const infoFilm = responseFilm.data.results;
        const infoSerie = responseSerie.data.results;

        const responseData = [];

        infoFilm.forEach((item, index) => {
          const backdrop_path=item.backdrop_path===null?'':'https://www.themoviedb.org/t/p/w500'+item.backdrop_path
          const movie = {
            id: item.id,
            name: item.original_title,
            overview: item.overview,
            release_date: item.release_date,
            backdrop_path: backdrop_path,
            vote_average: item.vote_average,
            imgAlt: 'ImgFilm' + index,
            genre_ids: item.genre_ids,
            vote_count:item.vote_count,
            votato:false,
            votoValue:0,
            type: 'Film',
          };
          responseData.push(movie);
        });

        infoSerie.forEach((item, index) => {
          const backdrop_path=item.backdrop_path===null?'':'https://www.themoviedb.org/t/p/w500'+item.backdrop_path
          const serieTv = {
            id: item.id,
            name: item.name,
            overview: item.overview,
            release_date: item.first_air_date,
            backdrop_path: 'https://www.themoviedb.org/t/p/w500' +backdrop_path,
            vote_average: item.vote_average,
            imgAlt: 'ImgSerie' + index,
            genre_ids: item.genre_ids,
            vote_count:item.vote_count,
            votato:false,
            votoValue:0,
            type: 'Serie',
          }
           responseData.push(serieTv);
        });
        if(controll_array(responseData))
        setsearchData(responseData);

        }
        
      } catch (error) {
        console.error(error);
      }
    }else setmsgNotFound(true)
  }
  //gestione di una pagina (quanti items per pagina)
  function getCurrentPageData() {
    const filteredData = initialControll();
    if (controll_array(filteredData)) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      if (isClickedPreferito||searchIsClicked) return filteredData.slice(startIndex, endIndex);
      else return filteredData.slice(0,itemsPerPage)
    }
    return [];
  }
  //filtro prima di stampa
  function filterData() {
    
    if (controll_array(data)) {
      return data.filter((item) => {
        if (searchQuery.trim() !== '') {
          return item.type === type;
        } else { 
          return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            item.type === type
          );
        }
      });
    }
  
    return [];
  }
  //cambio pagina
  function handlePageChange(page) {
    setmsgNotFound(false)
    setCurrentPage(page);
  }
  //  per aprire il modal
  function openModal(index) {
    setSelectedImage(index);
    setIsModalOpen(true);
  }
  //chiusura modal
  function handleOutsideClick(event) {
    if (event.target.className === 'modal') {
      setIsModalOpen(false);
    }
  }
  //...
  function CorpoData() {
    controll_changeIsPreferiti()
    controllVoto()
    const currentPageData = getCurrentPageData();
    return (
      <div className="image-grid">
        {currentPageData.map((item, index) => (
          <div
            className="image-item"
            key={index + (currentPage - 1) * itemsPerPage}
            ref={selectedImage === index ? selectedImageRef : null}
          >
            
              <img
                id={'img' + index}
                src={item.backdrop_path}
                alt={item.imgAlt}
                onClick={() => openModal(index)} // Aggiunto onClick per aprire il modal
              />
            
          </div>
        ))}

        {/* Modal */}
        {isModalOpen && selectedImage !== null && (
          <Modal
            selectedImageData={currentPageData[selectedImage]}
          />
        )}
      </div>
    );
  }
  //paginazione preferiti e ricerca
  function PaginationPreferitiSearch() {
    const filteredData = isClickedPreferito?dataPreferiti:searchData;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`page-number ${number === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
    );
  }
  function Paginazione(){
    const pageNumbers = [];
    //se il tipo è film,massimo di pagina è quello del film,se è del serie,massimo di pagina è quello della serie, altrimenti è la somma
    //let max = type==='film'?maxPageFilm:type==='serie'?maxPageSerie:maxPageFilm+maxPageSerie;
    console.log(maxPageFilm,maxPageSerie)
    let max = 500 
    let end = currentPage + 2;
    let min = 1
    if (end > max) end = max;
    
    for (let i = currentPage; i <= end; i++) {
      pageNumbers.push(i);
    }
    //frecce per tornare nella pagina precedente riga 257
    return (
      <div className="pagination">
        {currentPage!==min&&(<button onClick={()=>handlePageChange(min)}>{'<<'}</button>)}
        {currentPage>min&&(<button onClick={()=>handlePageChange(currentPage-min)}>{'<'}</button>)}
        
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`page-number ${number === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}

        {currentPage<max&&(<button onClick={()=>handlePageChange(currentPage+min)}>{'>'}</button>)}

        {currentPage!==max&&(<button onClick={()=>handlePageChange(max)}>{'>>'}</button>)}
      </div>
    );
  }
  function Vota({ selectedImageData }) {
    const [isClickVota, setIsClickVota] = useState(false);
    const [votoValue, setVotoValue] = useState('');
    const [errMsgVoto, setErrMsgVoto] = useState(false);
  
    const handleVotoValueChange = (event) => {
      setVotoValue(event.target.value);
    };
  
    function voto(selectedImageData, value) {
      if (value < 11 && value > 0) {
        setErrMsgVoto(false);
        setIsClickVota(false);
        const tipo = selectedImageData.type === 'Film' ? 'movie' : 'tv';
        const options = {
          method: 'POST',
          url: `https://api.themoviedb.org/3/${tipo}/${selectedImageData.id}/rating`,
          params: { guest_session_id: '54e128e879644507f980cd32676132ef' },
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2ZkMTcyOGRkMjg5Y2ZkMGRmZWY4ZWI2MDRiODJjZCIsInN1YiI6IjY0NzhiYzRhZTMyM2YzMDBjNDI4Y2I2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oTn7cdmGu3I8iyLZxBJBs53gSRZ63HBya3x5dK9n15I',
          },
          data: `{"value":${value}}`,
        };
    
        axios
          .request(options)
          .then(function (response) {
            // Aggiornamento dei dati del film dopo il voto
            axios
              .get(`https://api.themoviedb.org/3/${tipo}/${selectedImageData.id}`, {
                params: {
                  api_key: '615792ad94b3cc4c4bd1598289bca684', 
                },
              })
              .then(function (response) {
                // aggiungi+controllo
                selectedImageData.votato = true
                selectedImageData.votoValue=value
                const isDuplicate = VotedData.some((votato) => votato.id === selectedImageData.id)
                if (isDuplicate) return
                const newDataVotato = [...VotedData, selectedImageData]
                setVotedData(newDataVotato);
                window.localStorage.setItem('votedData', JSON.stringify(newDataVotato))
              })
              .catch(function (error) {
                console.error(error);
              });
          })
          .catch(function (error) {
            console.error(error);
          });
      } else {
        setErrMsgVoto(true);
      }
    }
  
    const annullaVoto = () => {
      setIsClickVota(false);
      setVotoValue('');
      setErrMsgVoto(false);
    };
  
    const changeBtnVota = () => {
      setIsClickVota(true);
    };
  
    return (
      <div>
        {isClickVota ? (
          <p>
            <input value={votoValue} type="number" onChange={handleVotoValueChange} />
            <button onClick={() => voto(selectedImageData, votoValue)}>{t('Vota')}</button>
            <button onClick={annullaVoto}>{t('Annulla voto')}</button>
          </p>
        ) : (
          <button onClick={() => changeBtnVota()}>{t('Vota Questo')} {t(selectedImageData.type)}</button>
        )}
        {errMsgVoto && <h2 className='errore'>{t('ERROR')}</h2>}
      </div>
    );
  }
  
  function eliminaVoto(selectedImageData) {
    const tipo = selectedImageData.type === 'Film' ? 'movie' : 'tv';
    const options = {
      method: 'DELETE',
      url: `https://api.themoviedb.org/3/${tipo}/${selectedImageData.id}/rating`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Y2ZkMTcyOGRkMjg5Y2ZkMGRmZWY4ZWI2MDRiODJjZCIsInN1YiI6IjY0NzhiYzRhZTMyM2YzMDBjNDI4Y2I2OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oTn7cdmGu3I8iyLZxBJBs53gSRZ63HBya3x5dK9n15I',
      },
    };
    /*const typeAndId = {
      type:selectedImageData.type,
      id:selectedImage.id
    }*/ 
    //axios.post('',)
    axios
      .request(options)
      .then(function (response) {
        // Rimuovi il film/serie votato dall'array votedData
        const newDataVotato = VotedData.filter((votato) => votato.id !== selectedImageData.id)
        setVotedData(newDataVotato)
        window.localStorage.setItem('votedData', JSON.stringify(newDataVotato))
        selectedImageData.votato = false
        selectedImageData.votoValue=0
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  //componente
  function DeleteVoto({selectedImageData}){
    return(
      <div>
        <button onClick={()=>eliminaVoto(selectedImageData)}>{t('Elimina voto')}</button>
      </div>
    );
  }
  // Componente Modal
  function Modal({ selectedImageData }) {
    setGenre(fetchGenres(selectedImageData))//cattura della richiesta per il genere
    if (!selectedImageData) {
      return null; 
    }
    return (
      <div className="modal">
        <div className="modal-content">
            <img src={selectedImageData.backdrop_path}alt='img'></img>
            <h2>
              {selectedImageData.name+'   '} 
              {selectedImageData.isPreferito ? 
              (<button id='remHeart' onClick={()=>removePreferito(selectedImageData)}>{t('-ELIMINA PREFERITO')}<MdHeartBroken/></button>)
              :
               <button id='addHeart' onClick={()=>addPreferiti(selectedImageData)}>{t('+AGGIUNGI PREFERITI')}<BiHeart /></button>}
            </h2>
            <h3>{genre}</h3>
            <p>{t('Id')}: {selectedImageData.id}</p>
            <p>{t('Tipo')}: {selectedImageData.type}</p>
            <p>{t('Voto medio')}: {selectedImageData.vote_average}/10</p>
            <p>{t('Voti')} :{selectedImageData.vote_count}</p>
            <p>{t('Data di rilascio')}: {selectedImageData.release_date}</p>
            <p>{t('Panoramica')}: {selectedImageData.overview}</p>
            {selectedImageData.votato&&selectedImageData.votoValue!==0&&(<p>{t('il tuo voto')} : {selectedImageData.votoValue}</p>)}
            {selectedImageData.votato&&(<DeleteVoto selectedImageData={selectedImageData}/>)}
            {!selectedImageData.votato&&(<Vota selectedImageData={selectedImageData}/>)}
        </div>
      </div>
    );  
  }
  
//font + navbar + corpo + paginazione
  return (
    <div>
      <div id="navDiv">
        <ImportStyle/>
        <NavBar
          changetypeFilm={changetypeFilm}
          changeTypeSerie={changeTypeSerie}
          changePreferito={changePagePreferito}
          handleSearch={handleSearch}
          
          setSelectedValueLingua={setSelectedValueLingua}
          selectedValueLingua={selectedValueLingua}
        />
        </div>
        <div id='mainDiv'>
          {msgNotFound ?
          (<h1 id='notFound'>Error: Not found</h1>)
           :
          (<CorpoData />)}
        </div>
       <a href='#footer'> <div id='footer'>{(isClickedPreferito||searchIsClicked)?(<PaginationPreferitiSearch/>):(<Paginazione/>)}</div></a>
      </div>
  );
}
