class CategoryNode{
	
	constructor(categoryID, categoryName){
		this.categoryID = categoryID;
		this.categoryName = categoryName;
		this.children = [];
	}

	addChild(childNode){
		this.children.push(childNode);
	}
}

class CategoryTree{
	
	constructor(data){
		this.data = data;
		this.layer1 = {};
		this.categoryMap = {};
		
		this.data.forEach((eachData)=>{
			let node = new CategoryNode(eachData.categoryID,eachData.categoryName)
			this.categoryMap[eachData.categoryID] = node;
			//建立node物件
			//ex. CategoryNode {categoryID: "0", categoryName: "衣著", children: Array(0)}
		});
		
		this.data.forEach((eachData)=>{
			if(eachData.parentID != -1){ //parentID=999，為沒有parent的category
				this.categoryMap[eachData.parentID].addChild(this.categoryMap[eachData.categoryID]);
			}else{
				this.layer1[eachData.categoryID] = this.categoryMap[eachData.categoryID];
			}
		})
		//console.log(this.categoryMap);
	}
	
}

