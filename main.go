package main
import (
	"fmt"
	"encoding/json"
	"net/http"
	"html/template"
)
type Data struct{
	Pregnancies  float32
	Glucose   float32		
	BloodPressure   float32
	SkinThinkness   float32
	Insulin   float32
	Bmi   float32
	Dpf   float32
	Age   float32
	KValue int
}
type Result struct{
	Prediction int
	Neighbors [][]float32
}
var tmpls *template.Template
var trainData [][]float32
func init(){
	tmpls=template.Must(template.ParseGlob("./frontend/templates/*.gohtml"))
	trainData=open_file("dataset.csv")
}
func main(){
	fmt.Println("Escuchando en puerto 8080")
	mux:=http.NewServeMux()
	mux.Handle("/resources/",http.StripPrefix("/resources",http.FileServer(http.Dir("./frontend"))))
	mux.Handle("/favicon.ico",http.NotFoundHandler())

	mux.HandleFunc("/",handlerRoot)
	mux.HandleFunc("/data",handlerData)
	http.ListenAndServe(":8080",mux)

}
func handlerRoot(w http.ResponseWriter, req *http.Request){
	error:=tmpls.ExecuteTemplate(w,"index.gohtml",nil)
	check(error)
	return
}

func handlerData(w http.ResponseWriter, req *http.Request){
	w.Header().Set("Content-Type", "application/json")
	var datosEntrada Data
	err:=json.NewDecoder(req.Body).Decode(&datosEntrada)
	if err!=nil{
		http.Error(w,err.Error(),http.StatusBadRequest)
		return
	}

	//KNN ALGORITHM
	prediction,neighbors:=predict_classification(trainData,[]float32{
		datosEntrada.Pregnancies,
		datosEntrada.Glucose,
		datosEntrada.BloodPressure,
		datosEntrada.SkinThinkness,
		datosEntrada.Insulin,
		datosEntrada.Bmi,
		datosEntrada.Dpf,
		datosEntrada.Age,
		},datosEntrada.KValue)
	//FIN KNN ALGORITHM
	
	var result Result
	result.Prediction=prediction
	result.Neighbors=neighbors
	data,_:=json.Marshal(result)
	fmt.Println(result)
	fmt.Fprintln(w,string(data))
	

	return
}
func check(err error) {
	if err != nil {
		fmt.Println(err)
	}
}