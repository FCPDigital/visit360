
<div class="visite">
  <!-- Maps -->

  <div class="visite__archive">
    
    <div class="visite__util ">
      <button id="close-map-button" class="map__close"></button>
      
      <div class="map__nav nav">
      
        <?php foreach ($maps as $key => $map) { ?>
          <p class="nav__item <?php if($key === count($maps) - 1) : echo "nav__item--last"; endif; ?>" data-map="<?php echo $map->id; ?>"><?php echo $map->title; ?></p>    
        <?php } ?>
      </div>

    </div>

    <div class="map__container">

      <?php foreach ($maps as $key => $map) { ?>

        <div id="<?php echo $map->id ?>" 
          class="map" 
          data-url="<?php echo $map->img; ?>">
          <div class="marker__container">
            <?php foreach($map->markers as $key => $marker) { ?>
              <div class="marker" data-marker='<?php echo $marker; ?>'>
                <div class="marker__point"></div>
                <p class="marker__title"><?php echo $marker->title; ?></p>
                <div class="marker__bubble marker__bubble--hidden">
                  <p class="marker__bubble-title"><?php echo $marker->title; ?></p>
                  <div class="marker__bubble-img" style="background-image: url('<?php echo $marker->thumbnail; ?>')"></div>
                </div>
              </div>
            <?php } ?>
          </div>
        </div>
      <?php } ?>
    </div>
  
  
  </div>


  <!-- Photo Frame -->
  <div class="photo single-marker">
    <div class="photo__thumbnail-back">
      <div class="photo__thumbnail-back-container">
        <img class="photo__thumbnail-back-img"/>
          <div class="marker__container">
            <!--<span class="marker" data-marker=''></span>-->
          </div>
      </div>
    </div>
    <canvas id="photo" class="photo__canvas"></canvas>

    <div class="photo__sidebar">
      <button class="photo__sidebar-close"></button>
      <div class="photo__sidebar-body">
        <h1 class="photo__sidebar-title">Photo 1</h1>
        <div class="photo__sidebar-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus elit ut vehicula commodo. Praesent non metus risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget placerat massa, sed finibus tellus. Praesent sed velit eleifend, facilisis tortor in, elementum massa. Phasellus vestibulum nisi ac mauris gravida, a eleifend lacus commodo. Proin sagittis, nunc sed ullamcorper elementum, leo lacus pellentesque risus, vitae vehicula mi eros vitae massa.</p>
          <p>
        </div>
      </div>
    </div>
  </div>
</div>