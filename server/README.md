url	description	method	permissions	parameters	body	returns	optional parameters	CRUD Operation	errors	headers
כתובת	תאור	method	הרשאות	פרמטרים	body	מה מחזיר	פרמטרים אופציונליים	CRUD Operation	מקרי קיצון - מה השרת מחזיר אז	headers
/api/recipe	שליפת כל המתכונים	get		-	-	recipe[]	search - חיפוש לפי שם מתכון	READ		Authorization
						"{
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  }"	page - מס' עמוד			
							perPage - מס' מתכונים לעמוד			
/api/recipe/{id}	שליפת מתכון לפי קוד	get		{id} – קוד מתכון	-	"{
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  }"	-	READ	...	
						,tags:[],speaker:{firstName,lastName},startDate}				
/api/recipe	מוסיף מתכון חדש למסד הנתונים ומחיזר אותו	post		-	"{
    name,  descriptio,    categoriespreparationTimeInMinutes,difficulty,
    date,
    layers: {
    [{    descriptio,      ingredients
        }]
    },
    instructions },
    image,
  isPrivate,
    user"	"{
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  }"	-	CREATE	אם חסרים שם או מחיר יחזיר קוד 404...	
										
					,tags:[],speaker:{firstName,lastName},startDate}	,tags:[],speaker:{firstName,lastName},startDate}				
/api/recipe/{id}	מוחק מתכון ממסד הנתונים 	 delete		{id} – קוד מתכון	-	{_id,name,price,numLessons	-	DELETE	אם לא קיים קורס כזה מחזיר קוד 404 , אם הקוד לא ייתכן מחזזח...	
						,tags:[],speaker:{firstName,lastName},startDate				
/api/recipe/userId/{userId}	קבלת המתכונים למשתמש מסוים	GET		{id} – קוד משתמש		"recipe[{
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  }]"		GET		
/api/recipe//time/{preparationTime}	קבלת מתכון לפי זמן הכנה	GET		זמן הכנה		"[{
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  }]"		GET		
/api/recipe/{id}	מעדכן פרטי מתכון ומחזיר את המתכון לאחר העדכון	Put		{id} – קוד מתכון	"{
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  }"	"{
    name: { type: String, required: true },
    description: { type: String },
    categories: { type: [] },
    preparationTimeInMinutes: { type: Number, min: 1, default: 10 },
    difficulty: { type: Number, min: 1, max: 5 },
    date: { type: Date },
    layers: {
        type: [{
            description: String,
            ingredients: [String]
        }]
    },
    instructions: { type: [String] },
    image: { type: String },
    isPrivate: { type: Boolean },
    user: { type: mongoose.Types.ObjectId }
  }"	-	UPDATE	אם	
					,tags:[],speaker:{firstName,lastName},startDate}					
/api/recipe/{id}	שליפת כל הקטגוריות	GET				"[description: { type: String, required: true },
      }]"		READ		
	שליפת כל הקטגוריות עם המתכונים	GET				"[description: { type: String, required: true },
    recipes: {
        type: [recipeSchema]
      }]"		READ		
/api/category	שליפת קטגוריה לפי ID	GET		{id} – קוד קטגוריה		"description: { type: String, required: true },
    recipes: {
        type: [recipeSchema]
      }"		READ		
/api/category//categories/withRecipes	קבלת כל המשתמשים	GET				"[{
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minlength: [4, 'password length < 4'] },
    email: { type: String, required: true, unique: true},
    address:{type:String},
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
}]"		READ		
/api/category/{id}	התחברות	POST			{username,password}	"{
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minlength: [4, 'password length < 4'] },
    email: { type: String, required: true, unique: true},
    address:{type:String},
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
}"		CREATE		
/api/user	הרשמה	POST			"{
    username: { type: String, required: true },
    firstNam, lastName, password,
    email, address,  role 
}"	"{
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, minlength: [4, 'password length < 4'] },
    email: { type: String, required: true, unique: true},
    address:{type:String},
    role: { type: String, default: 'user', enum: ['admin', 'user'] }
}"		CREATE		
