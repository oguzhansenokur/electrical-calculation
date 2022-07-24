import { View, Text, StyleSheet, SafeAreaView, TextInput, Button, Alert } from 'react-native'
import React,{useEffect, useState} from 'react'
import { BottomSheet } from 'react-native-btr'
import  AsyncStorage  from '@react-native-async-storage/async-storage';


const App = () => {
  const [customerID, setCustomerID] = useState('')
  const [unit, setUnit] = useState(0)
  const [visible,setVisible]=useState(false)
  const [estimatedCost,setEstimatedCost]=useState<Array<any>>([])
  const [costs,setCosts]=useState<Array<any>>([])
  const [toggleBottom2ndVisible,setToggleBottom2ndVisible]=useState(false)
  const handleCustomerID=(id)=>{setCustomerID(id)}
  const handleUnit=(unit)=>{setUnit(unit)}

  

  useEffect(()=> {
getCosts()
  },[costs])
  
  const toggleBottomTable=()=>{
    setVisible(!visible)
    setCustomerID('')
    setUnit(0)
  }
  const toggleBottom2nd=()=>{
    setToggleBottom2ndVisible(!toggleBottom2ndVisible)
  }
 
  const getCosts= async ()=>{
    const result = await AsyncStorage.getItem('costs')
    if(result!==null)
    {
      setCosts(JSON.parse(result))
    }
  }

  function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }

const calculateCostElectricity = () => {
  var cost = 0;
    
    
    if(containsAnyLetter(customerID)){
      Alert.alert('Error', 'Customer ID must be numeric')
    }
    else if(customerID.length !=10){
      Alert.alert('Error', 'Customer ID must be 10 digits')
    }
    else if(unit<0){
      Alert.alert('Error', 'Unit must be positive') 
    }
    else{
      if(unit>=1 && unit <=100)
      {
        cost =unit*5
      }
      if(unit>=101 &&unit<=500)
      {
        cost=-1*(-100*5-((unit-100)*8))
      }
      if(unit>500)
      {
        cost=-100*5
        let extraUnit=unit-500
  
        let midUnit=unit-100-extraUnit
  
        cost=-1*(cost-((midUnit)*8)-((extraUnit)*10))
        }
        if(costs.map(item=>item.customerID!==customerID))
        {
          var today = new Date();
          var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
       const estimated={id:Date.now(),customerID:customerID,cost:cost,used:unit,date:date}
       setEstimatedCost(estimated)
       toggleBottomTable()
        }
        else{
          var today = new Date();
          var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
       const estimated={id:Date.now(),customerID:customerID,cost:cost,used:unit,date:date}
       setEstimatedCost(estimated)
       toggleBottom2nd()
        }
  
    }

   

   

}
const saveCost= async ()=>{
    const saving=[...costs,estimatedCost]
    setCosts(saving)
    await AsyncStorage.setItem('costs',JSON.stringify(costs))
    toggleBottomTable()
   
  
}
const saveCost2nd=async ()=>{
  
}

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
     <View style={styles.content} >
      <View style={styles.upSide}  >
         <TextInput keyboardType='numeric' placeholder='Enter Your Customer ID' value={customerID} onChangeText={handleCustomerID} style={{marginTop:30,width:'100%' , height:'13%',backgroundColor:'#fff',borderRadius:20,borderColor:'black',padding:10}} />
         <TextInput keyboardType='numeric' placeholder='Enter Your Meter' value={unit} onChangeText={handleUnit} style={{marginTop:30,width:'50%' , height:'13%',backgroundColor:'#fff',borderRadius:20,borderColor:'black',padding:10}} />

       <View style={{margin:25}} ><Button onPress={calculateCostElectricity} title="Submit" color='blue'  /></View>  

      </View>
      <View style={styles.buttonSide}  >
      </View>
      <View>

      </View>

     </View>

     <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomTable}
        onBackdropPress={toggleBottomTable}
      >
        <View style={styles.card}>
          <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'row',margin:25,justifyContent:'space-around'}} >
            <View   ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Customer ID</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}}>{estimatedCost.customerID}</Text></View></View>
            <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Estimated Cost</Text></View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{estimatedCost.cost}$</Text></View></View>
            <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Used Unit</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{estimatedCost.used}</Text></View></View>
            <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Date</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{estimatedCost.date}</Text></View></View>

          </View>
         
          </View>
          <View style={{flexDirection:'column',width:'100%',justifyContent:'center'}} >
          <View style={{flexDirection:'row',width:'100%',justifyContent:'center'}} >
         <View style={{margin:10}}><Button onPress={saveCost} title='Save' color='green'   /></View> 
         <View style={{margin:10}} ><Button onPress={toggleBottomTable} title='Cancel' color='red' /></View> 
          
          </View>
          </View>
          {costs.reverse().map((item)=>{
            if(item.customerID==customerID)
            {
              return(
             <View style={{flexDirection:'column'}}>
              <View style={{flexDirection:'row',margin:25,justifyContent:'space-around'}} >
                <View   ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Customer ID</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}}>{item.customerID}</Text></View></View>
                <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Estimated Cost</Text></View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{item.cost}$</Text></View></View>
                <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Used Unit</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{item.used}</Text></View></View>
                <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Date</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{item.date}</Text></View></View>
    
              </View>
             
              </View>)
            }
          })}


        </View>
      </BottomSheet>
      <BottomSheet
        visible={toggleBottom2ndVisible}
        onBackButtonPress={toggleBottom2nd}
        onBackdropPress={toggleBottom2nd}
      >
        <View style={styles.card}>
          <View><Text>History and Estimated</Text></View>
          <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'row',margin:25,justifyContent:'space-around'}} >
            <View   ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Customer ID</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}}>{estimatedCost.customerID}</Text></View></View>
            <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Estimated Cost</Text></View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{estimatedCost.cost}$</Text></View></View>
            <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Used Unit</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{estimatedCost.used}</Text></View></View>
            <View  ><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{fontWeight:'bold'}}>Date</Text></View><View style={{borderColor:'black',borderWidth:2,padding:10}}><Text style={{alignSelf:'center'}} >{estimatedCost.date}</Text></View></View>

          </View>
         
          </View>
          <View style={{flexDirection:'column',width:'100%',justifyContent:'center'}} >
          <View style={{flexDirection:'row',width:'100%',justifyContent:'center'}} >
         <View style={{margin:10}}><Button onPress={saveCost} title='Save' color='green'   /></View> 
         <View style={{margin:10}} ><Button onPress={toggleBottom2nd} title='Cancel' color='red' /></View> 
          
          </View>
          </View>

        </View>
      </BottomSheet>

    </View>
    </SafeAreaView>
  )
}

export default App

const styles= StyleSheet.create({
  container: {
    flex: 1,
  },
  content:{
    backgroundColor:'#E1E0E1',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  upSide:{
    marginTop: '25%',
    padding:15,
    height: '50%',
  },
  buttonSide:{
    padding:15,
    height: '50%',
  },
  card: {
    backgroundColor: "#fff",
    height: '100%',
   
  },
  
})