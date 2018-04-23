<?php 


class VisitMarker {

	public $post = null;
	public $thumbnail = null;
	public $photo = null;
	public $has_3d = true; 
	public $x = null;
	public $y = null;
	public $title = null; 

	public function __construct($arg)
	{
		if(is_numeric($arg)) {
			$post = get_post($arg); 
		}

		if($arg instanceof WP_Post){
			$post = $arg;
		}

		$this->id = $post->ID;
		$this->post = $post;
		$this->title = get_the_title($post);
		$this->thumbnail = get_the_post_thumbnail_url($this->post, "original");
		$this->photo = get_field("photo_3d", $this->post);

		if(!get_field("photo_3d", $this->post)){
			$this->photo = false;
		}
		if(!get_field("has_3d", $this->post)){
			$this->has_3d = false;
		}
		if(get_field("left", $this->post)){
			$this->x = get_field("left", $this->post) / 100;
		}
		if(get_field("top", $this->post)){
			$this->y = get_field("top", $this->post) / 100;
		}
	}

	public function __toString()
	{
		return json_encode([ 
			"x" => $this->x,
			"y" => $this->y,
			"thumbnail" => $this->thumbnail,
			"has_3d" => $this->has_3d,
			"photo" => $this->photo,
			"id" => $this->id
		], JSON_UNESCAPED_SLASHES);
	}

}