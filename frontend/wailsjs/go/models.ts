export namespace models {
	
	export class Item {
	    Url: string;
	    Name: string;
	    Brand: string;
	    Description: string;
	    ImageLink: string;
	    Hide: boolean;
	    Components: string[];
	    Error: string;
	
	    static createFrom(source: any = {}) {
	        return new Item(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Url = source["Url"];
	        this.Name = source["Name"];
	        this.Brand = source["Brand"];
	        this.Description = source["Description"];
	        this.ImageLink = source["ImageLink"];
	        this.Hide = source["Hide"];
	        this.Components = source["Components"];
	        this.Error = source["Error"];
	    }
	}

}

