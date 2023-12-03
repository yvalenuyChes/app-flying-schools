import { useLocation } from "react-router-dom"
import Button from '../../components/Button/Button'
import styles from './styles.module.scss'
import { useEffect, useState } from "react"
import axios from "axios"

export default function School(){

   const currentDate = new Date().toJSON().slice(0, 10)
   const location = useLocation()
   const [service, setService] = useState('')
   const [serviceDate, setServiceDate]  = useState('')
   const [companie, setCompanie] = useState({})
   const [addingTime, setAddingTime] = useState(0)
   const [loading, setLoading] = useState(true)
   const [price, setPrice] = useState(0)
   const [availableTime, setAviableTime] = useState(false)
   const [time, setTime] = useState('')
   const [message, setMessage] = useState(null)

   useEffect(() => {
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const config = {
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
         method:"GET",
         url:'http://localhost:8000/get_company_by_name',
         data:{
            schoolName:location.state.schoolName
         }
      }

      axios(config)
      .then(result => {
         setCompanie(prev => result.data)
         setLoading(false)
      })
      
      .catch(err => {
         console.log(err)
      })
   }, [])


   useEffect(() => {
      if(!loading){
         setPrice(Number(companie.price[service].commonPrice))
      }
     
   }, [service])
   

   const checkTimeHandler = () => {

      console.log(companie.schoolName,`${time}:00`, serviceDate)

      const configuration = {
         method:'GET',
         url:'http://localhost:8000/check_user',
         data:{
            schoolName: companie.schoolName,
            timeFrom: `${time}:00`,
            date:serviceDate
         }
       
      }

      axios(configuration)
      .then(result => {
         if(result){
            setAviableTime(false)
            setMessage('Время занято')
         }else{
            setAviableTime(true)
            setMessage(null)
         }
      })
      
   }





   const serviceDateHandler = event => {
      setServiceDate(event.target.value)
   }

   const setAddingTimeAboveHandler = () => {
      if(addingTime >= 0){
         setAddingTime(prev => prev + Number(companie.serviceTime[service].addingTime))
         setPrice(prev => prev + Number(companie.price[service].addTime) )
      }
   }

   const setAddingTimeLessHandler = () => {
      if(addingTime > 0){
         setAddingTime(prev => prev - Number(companie.serviceTime[service].addingTime  ))
         setPrice(prev => prev -  Number(companie.price[service].addTime) )
      }
   }

  

   return(
      <div>
         <div>
            <h2 className={styles.school__title}>

               {
                Object.keys(companie) !== 0
               ? companie.schoolName
               : null
               }
            </h2>
            <div className={styles.school__subtitle}  >
               <p>
                  Выберете услугу
               </p>
            </div> 
               <div className={styles.school__buttons} >
                  <Button 
                  text={'Discovery fly'} 
                  onClick={() => {setService('Discovery fly')}} 
                  />
                  <Button 
                  text={'Time building'} 
                  onClick={() => {setService('Time building')}}
                  />
                  <Button 
                  text={'Education'} 
                  onClick={() => {setService('Education')}}
                  />
               </div>
            <div>
               {
                  service
                  ?
                  <div className={styles.school__form}>
                     <div  >
                        <h4 className={styles.school__subtitle}>Дата</h4>
                     </div>
                     <h3 className={styles.school__subtitle}>{service}</h3>
                     <input 
                        type="date" 
                        min={currentDate} 
                        value={serviceDate} 
                        onChange={serviceDateHandler} 
                     />
                     {
                        serviceDate
                        ?
                        <div className={styles.school__form__container} >
                           <h4>Добавление времени: {companie.serviceTime[service].addingTime}m</h4>
                           <h4>Минимальное время: {companie.serviceTime[service].commonTime}m</h4>
                           <div>
                              Время записи от
                               {
                                 Object.keys(companie) !== 0
                                 ?
                                 ` ${companie.workTime[0]} `
                                 : '...'
                               } 
                               до 
                               {

                                 Object.keys(companie) !== 0
                                 ?
                                 ` ${companie.workTime[ companie.workTime.length - 1]} `
                                 : '...'
                               }
                           </div>
                           <div>
                             <h4>Временные промежутки:</h4>
                             <div  >
                             {
                                  Object.keys(companie) !== 0
                                 ?
                                 <div className={styles.school__form_time} >
                                    <select value={time} onChange={(e) => {setTime(e.target.value)}}  >
                                    {
                                       companie.workTime.map((hour, key) => {
                                          return(
                                             <option
                                                value={hour} 
                                                key={key}
                                                // onClick={() => {
                                                //    setTime(hour)
                                                //    console.log(time) 
                                                // }}
                                             >{hour}:00</option>
                                             ) 
                                        })
                                    }
                                    </select>
                                    <div>
                                       <h3>Дополнительное время:</h3>
                                       <p>{`${addingTime} m`}</p>
                                       <div className={styles.school__form_time_buttons}>
                                          <Button text={'-'} onClick={setAddingTimeLessHandler}  width={'60px'} height={'30px'} />
                                          <Button text={'+'} onClick={setAddingTimeAboveHandler} width={'60px'} height={'30px'} />
                                       </div>

                                    </div>
                                    <div className={styles.school__form_time__price}>
                                       <h3>Цена за услугу:</h3>
                                       <p>{`${price} $`}</p>
                                    </div>
                                    <div>
                                       <Button text={'Проверить время'} onClick={checkTimeHandler} />
                                       {
                                          message
                                          ? <p>{message}</p>
                                          : null
                                       }
                                    </div>
                                    {
                                       availableTime
                                       ?
                                       <div>
                                          <input placeholder="Name" autoFocus={true} />
                                          <input placeholder="Surname" />
                                          <Button text={'Заказать'} />
                                       </div>
                                       :
                                       null
                                    }
                                 </div>
                                

                                 : '...'
                              }
                              </div> 
                           </div>
                        </div>


                        : null
                     }
                  </div>

                  : null
               }
            </div>
         </div>
      </div>
   )

}