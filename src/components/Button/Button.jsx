import styles from './style.module.scss'

export default function Button({
   text, 
   buttonColor = 'primary',
   onClick,
   width,
   height
}){
   return(
      <div>
         <button 
            className={styles.button + ' ' + styles[buttonColor]} 
            onClick={onClick}
            style={{
               width: width ? width : '200px',
               height: height ? height : '50px'
            }}
              
         >{text}</button>
      </div>
   )
}