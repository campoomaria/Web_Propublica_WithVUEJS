let config = {
  headers: { 
    "X-API-Key": "m500rkVNkXKwcafHrPrLYTsx6PvyY3dpVr9pWAxY"
  }
}

if(document.title == "House starter" || document.title == "Attendance House" || document.title == "House party"){
  urlPropublica = 'https://api.propublica.org/congress/v1/117/house/members.json'
}
if(document.title == "Senate starter" ||document.title =="Attendance Senate" || document.title == "Senate party"){
  urlPropublica = 'https://api.propublica.org/congress/v1/117/senate/members.json'
}

const { createApp } = Vue

createApp({
  data() {
    return {
      copiaSenate: [],
      memberFiltrados : [],
      partys : ['D','R','ID'],
      State : 'ALL',

      copiaMember: [],
      statistics : {
      D: "Democrats",
      R: "Republicans", 
      ID: "Independents",
      numberMembers: 0,
      numberOfD: 0,
      numberOfR: 0,
      numberOfID: 0,
      votesMembers: 0,
      votesD: 0,
      votesR:0,
      votesID: 0,
      democrats:[],
      republicans:[],
      independients:[],
      lessMissedVotes:[],
      mostMissedVotes:[],
      lessMissedVotesloyalty: [],
      mostMissedVotesloyalty: []  
      }
    } 
  },
    created(){
      fetch(urlPropublica,config)
          .then(res => res.json())
          .then(datos => 
            {
              this.copiaSenate = datos.results[0].members
              this.memberFiltrados = datos.results[0].members  
              this.copiaMember = datos.results[0].members
              console.log(this.copiaMember)
              this.statistics.democrats = this.copiaMember.filter(member => member.party === "D")
              this.statistics.republicans = this.copiaMember.filter(member => member.party === "R")
              this.statistics.independients = this.copiaMember.filter(member => member.party === "ID")    
              this.statistics.numberOfD = this.copiaMember.filter(member => member.party === "D").length 
              this.statistics.numberOfR = this.copiaMember.filter(member => member.party === "R").length
              this.statistics.numberOfID =  this.copiaMember.filter(member => member.party === "ID").length
              this.statistics.numberMembers=this.statistics.numberOfD + this.statistics.numberOfR + this.statistics.numberOfID  
              this.statistics.votesD = Number(this.sumaVotewithparty(this.statistics.democrats,'votes_with_party_pct').toFixed(2))

              this.statistics.votesR=Number(this.sumaVotewithparty(this.statistics.republicans,'votes_with_party_pct').toFixed(2))
              console.log(this.statistics.republicans)
              console.log(this.statistics.votesR);                          
              
              let independients=Number(this.sumaVotewithparty(this.statistics.independients,'votes_with_party_pct').toFixed(2))
              this.statistics.votesID=independients?independients:0
              if(this.statistics.numberOfID == 0){
                this.statistics.votesMembers=((this.statistics.votesD + this.statistics.votesR)/2).toFixed(2)
              }else{  
               this.statistics.votesMembers=((this.statistics.votesD + this.statistics.votesR + this.statistics.votesID)/3).toFixed(2)
              }  
              this.numbermissedvotes(this.copiaMember, 'missed_votes_pct')
              this.numbermissedvotes(this.copiaMember, 'total_votes')              
            })
          .catch(err => console.log(err))          
        },
        methods: {
          sumaVotewithparty: function(miembros, valor) {
            let sumaD = miembros.filter(member => member[valor]).map(member => member[valor]).reduce((acc, act) => acc + act,0)   
            let prom = sumaD/miembros.length
            return prom
          },
          numbermissedvotes: function(miembros,valor){   
            
            let arraynumber = miembros.filter(miembro => miembro[valor]).length
            console.log(arraynumber)
            porcentaje = Math.ceil(arraynumber* 0.10)
            console.log(porcentaje);
            let arraymember=miembros.filter(miembro => miembro.total_votes).sort((a,b) => a[valor] - b[valor]).slice(0,porcentaje)
            let arraymember2=miembros.sort((a,b) => b[valor] - a[valor]).slice(0,porcentaje)
            this.statistics.mostMissedVotes=arraymember  
            this.statistics.lessMissedVotes=arraymember2
            this.statistics.lessMissedVotesloyalty=arraymember
            this.statistics.mostMissedVotesloyalty=arraymember2
            }
        },        
      computed: {
        filtrar : function(){
          this.memberFiltrados = this.copiaSenate.filter( member => {
              return this.partys.includes(member.party) 
                  &&  (this.State == 'ALL' || this.State == member.state)                  
          })  
        }
      } 
    }).mount('#senate')
    
