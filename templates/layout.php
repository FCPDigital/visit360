
<div class="v360-visite">
  <!-- Maps -->

  <div class="v360-visite__archive">
    
    <div class="v360-visite__util ">
      <button id="v360-close-map-button" class="v360-map__close"></button>
      
      <div class="v360-map__nav v360-nav">
      
        <?php foreach ($maps as $key => $map) { ?>
          <p class="v360-nav__item <?php if($key === count($maps) - 1) : echo "v360-nav__item--last"; endif; ?>" data-map="<?php echo $map->id; ?>"><?php echo $map->title; ?></p>    
        <?php } ?>
      </div>

    </div>

    <div class="v360-map__container">

      <?php foreach ($maps as $key => $map) { ?>

        <div id="<?php echo $map->id ?>" 
          class="v360-map" 
          data-url="<?php echo $map->img; ?>">
          <div class="v360-marker__container">
            <?php foreach($map->markers as $key => $marker) { ?>
              <?php if( $marker->photo ) { ?>
                <div class="v360-marker" data-marker='<?php echo $marker; ?>'>
                  <div class="v360-marker__point"></div>
                  <p class="v360-marker__title"><?php echo $marker->title; ?></p>
                  <div class="v360-marker__bubble v360-marker__bubble--hidden">
                    <p class="v360-marker__bubble-title"><?php echo $marker->title; ?></p>
                    <div class="v360-marker__bubble-img" style="background-image: url('<?php echo $marker->thumbnail; ?>')"></div>
                  </div>
                </div>
              <?php } // End if ?>
            <?php } // End foreach ?> 
          </div>
        </div>
      <?php } ?>
    </div>
  
  
  </div>


  <!-- Photo Frame -->
  <div class="v360-photo">
    <div class="v360-photo__thumbnail-back">
      <div class="v360-photo__thumbnail-back-container">
        <img class="v360-photo__thumbnail-back-img"/>
          <div class="v360-marker__container">
            <!--<span class="marker" data-marker=''></span>-->
          </div>
      </div>
    </div>
    <canvas id="v360-photo" class="v360-photo__canvas"></canvas>

    <div class="v360-photo__sidebar">
      <button class="v360-photo__sidebar-close"></button>
      <div class="v360-photo__sidebar-body">
        <h1 class="v360-photo__sidebar-title">Photo 1</h1>
        <div class="v360-photo__sidebar-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus elit ut vehicula commodo. Praesent non metus risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget placerat massa, sed finibus tellus. Praesent sed velit eleifend, facilisis tortor in, elementum massa. Phasellus vestibulum nisi ac mauris gravida, a eleifend lacus commodo. Proin sagittis, nunc sed ullamcorper elementum, leo lacus pellentesque risus, vitae vehicula mi eros vitae massa.</p>
          <p>
        </div>
      </div>
    </div>
  </div>
</div>