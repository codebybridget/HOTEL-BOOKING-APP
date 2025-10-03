
// get /api/user/
export const getUserData = async (req, res)=>{
    try {
       const role = req.user.role;
       const recetSearchedCities = req.user.recetSearchedCities;
        res.json({success: true, role, recetSearchedCities}) 
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export const storeRecetSearchedCities = async (req, res)=>{
    try {
        const {recetSearchedCity} = req.body
        const user = await req.user;

        if(user.recetSearchedCities.length < 3) {
            user.recetSearchedCities.push(recetSearchedCity)
        }else{
            user.recetSearchedCities.shift();
             user.recetSearchedCities.push(recetSearchedCity)
        }
        await user.save();
        res.json({success: true, message: "City added"})
    } catch (error) {
        res.json({success: false, message: error.message})
        
    }
}