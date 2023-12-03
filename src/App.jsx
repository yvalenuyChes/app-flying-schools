import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from './components/Button/Button'

import styles from './styles/appStyle.module.scss'


function App() {

  const [companiesName, setCompaniesName] = useState([])

  useEffect(() => {

    axios.get('http://localhost:8000/get_companies')
    .then(result => {
      setCompaniesName([...result.data])
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  console.log(companiesName);

  const navigate = useNavigate()

  return(
    <div>
      <div className={styles.wrapper} >
        {
          companiesName.length > 0

          ?
          companiesName.map((companyName, key) => {
            return(
              <Button
                key={key}
                text={companyName.schoolName}
                onClick={() => navigate(
                  `/${companyName.schoolName}`, 
                  {state:
                    {schoolName:companyName.schoolName}
                  })}
              />
            )
          })
          

          : <p>Нет добавленных компаний</p>
        }
      </div>
    </div>
  )
}

export default App
