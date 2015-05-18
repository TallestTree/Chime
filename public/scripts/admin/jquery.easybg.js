/**
 * easybg ver 1.0.3
 * 指定した背景画像を自動で切り替えるjQueryプラグイン
 *
 * written by sawarame 鰆目 靖士
 * http://sawara.me/
 *
 */
(function($)
{	
	var methods = {
		/**
		 * 初期化処理
		 */
		init : function(options)
		{
			return this.each(function()
			{
				var $this = $(this);
				var data = $this.data('easybg');
				if(data)
				{
					return true;
				}
				// メンバ変数初期化
				$this.settings = $.extend(defaults, options);
				
				// 現在のインデックス
				$this.workFlg = true;
				$this.currentIndex = $this.settings.initIndex;
				
				// 画像名が設定されていなければ何もしない
				if($this.settings.images === null)
				{
					return true;
				}
				// 配列でなければ配列にする
				if(!($this.settings.images instanceof Array))
				{
					$this.settings.images = [$this.settings.images];
				}
				
				// 画像を先読みする
				var promises = [];
				$.each($this.settings.images, function()
				{
					var imgFileName = this;
					var img = new Image();
					var defer = $.Deferred();
					// 画像読み込み成功時
					img.onload = function()
					{
						methods.log.apply($this, ['"' + this.src + '"の読み込み成功']);
						defer.resolve();
						defer = null;
					};
					// 画像読み込み失敗
					img.onerror = function()
					{
						methods.error.apply($this, ['"' + this.src + '"の読み込み失敗']);
						// エラーを無視する場合
						if($this.settings.ignoreError)
						{
							// 画像配列から対象の要素を削除
							for(var i = 0; i < $this.settings.images.length; i++)
							{
								var reg = new RegExp($this.settings.images[i] + "$");
								if(this.src.match(reg))
								{
									methods.log.apply($this, ['"' + this.src + '"の設定を解除します。']);
									$this.settings.images.splice(i,1);
								}
							}
							defer.resolve();
						}
						else
						{
							defer.reject();
						}
						defer = null;
					};
					img.src = imgFileName;
					promises.push(defer.promise());
				});
				
				// 画像の読み込みがすべて完了した時
				$.when.apply(null, promises).then(function()
				{
					methods.log.apply($this, ['全画像の読み込み完了しましたので処理を開始します。']);
					// 初期画像を表示
					methods.changeImage.apply($this, [$this.currentIndex]);
					//methods.setImage.apply($this, [$this.currentIndex]);
					
					var timer = null;
					timer = setInterval(function()
					{
						if($this.workFlg)
						{
							var index = 0;
							switch($this.settings.changeMode)
							{
								case 'random':
									do
									{
										index = Math.floor(Math.random() * $this.settings.images.length);
									}
									while($this.settings.images.length != 1 && index == $this.currentIndex);
									$this.currentIndex = index;
									break;
									
								case 'normal':
								default:
									if(++$this.currentIndex >= $this.settings.images.length)
									{
										$this.currentIndex = 0;
									}
									index = $this.currentIndex;
									break;
							}
							
							methods.changeImage.apply($this, [index]);
						}
					}, $this.settings.interval);
					
					// windowからフォーカスが外れた時は処理をしない様にする
					$(window).blur(function()
					{
						methods.stop.apply($this);
					});
					
					// windowにフォーカスが戻ってきたら処理を再開
					$(window).focus(function()
					{
						methods.start.apply($this);
					});
				},
				// 画像の読み込みが失敗した時
				function()
				{
					methods.error.apply($this, ['画像の読み込みに失敗認め終了します。']);
				});
				
				$this.data('easybg', {target : $this});
			});
		},
		/**
		 * 破棄処理
		 */
		destory : function()
		{
			return this.each(function()
			{
				var $this = $(this);
				$this.removeData('easybg');
			});
		},
		/**
		 * 背景画像を変更する処理
		 */
		changeImage : function(index)
		{
			// クローンが既に存在すれば何もしない
			if(this.find('.' + this.settings.cloneClassName).size() > 0)
			{
				methods.log.apply(this, ['切替中に切替えはできません。']);
				return;
			}
				
			// クローンを作成し、要素の裏側に配置
			var child1 = methods.makeClone.apply(this);
			methods.setImage.apply(child1, [methods.getImage.apply(this)]);
			methods.setZIndex.apply(child1, [methods.getZIndex.apply(this) - 1]);
			this.prepend(child1);
			
			// クローンを作成し次の画像を設定し、更にクローンの裏側に配置
			var child2 = methods.makeClone.apply(this);
			methods.setImageUrl.apply(child2, [this.settings.images[index]]);
			methods.setZIndex.apply(child2, [methods.getZIndex.apply(child1) - 1]);
			this.prepend(child2);

			// 一旦要素の画像の設定を解除
			methods.setImage.apply(this, ['none']);
			
			// 表側のクローンを透明に変更させる
			var self = this;
			child1.animate(
				{opacity: 0},
				self.settings.speed,
				'linear',
				function()
				{
					// 変更が完了したら要素の画像設定を変更し、クローンを削除
					methods.setImageUrl.apply(self, [self.settings.images[index]]);
					child1.empty().remove();
					child2.empty().remove();
				}
			);
			
			methods.log.apply(this, [index + ':"' + this.settings.images[index] + '"に切替']);
		},
		/**
		 * 要素のクローンを作成し要素に被せる
		 */
		makeClone : function()
		{
			// 要素のクローンを作成(style, class属性をコピー)
			//var child = this.clone(false).empty();
			var child = $('<div />');
			child.attr('style', this.attr('style'));
			child.attr('class', this.attr('class'));
			
			// IDは別で設定（デフォルトNULL）
			child.attr('id', this.settings.cloneClassId);
			
			// クローンにclassを設定
			child.addClass(this.settings.cloneClassName);
			
			// クローンを元要素に被せる
			child.css({
				position : 'fixed',
				top : this.offset().left,
				left : this.offset().top,
				width : this.outerWidth(),
				height : this.outerHeight()
			});
			return child;
		},
		/**
		 * 背景画像を設定
		 */
		setImage : function(image)
		{
			this.css('background-image', image );
		},
		/**
		 * 背景画像を設定
		 */
		setImageUrl : function(image)
		{
			this.css('background-image', 'url(' + image + ')');
		},
		/**
		 * 背景画像を設定
		 */
		getImage : function()
		{
			return this.css('background-image');
		},
		/**
		 * z-indexを指定
		 */
		setZIndex : function(index)
		{
			this.css('z-index', index);
		},
		/**
		 * z-indexを取得
		 */
		getZIndex : function(index)
		{
			return parseInt(this.css('zIndex'), 10) || 0;
		},
		/**
		 * z-indexを取得
		 */
		setOpacity : function(opacity)
		{
			this.css('opacity', opacity);
		},
		/**
		 * 処理を一旦停止
		 */
		stop : function()
		{
			this.workFlg = false;
			methods.log.apply(this, ['処理を一時停止']);
		},
		/**
		 * 処理を再開
		 */
		start : function()
		{
			this.workFlg = true;
			methods.log.apply(this, ['処理を再開']);
		},
		/**
		 * コンソールにログ出力
		 */
		log : function(str)
		{
			if(this.settings.debug)
			{
				console.log(str);
			}
		},
		/**
		 * コンソールにエラー出力
		 */
		error : function(str)
		{
			if(this.settings.debug)
			{
				console.error(str);
			}
		}
	};
	
	// 初期値
	var defaults = {
		images : null,
		interval : 30000, // 30秒
		speed : 1000, // 1秒
		ignoreError : false,
		changeMode : 'normal', // normal or random
		
		initIndex : 0,
		cloneClassId : null,
		cloneClassName : 'easybgClone',
		debug : false
	}

	$.fn.easybg = function(method)
	{
		if(methods[method])
		{
			return methods[ method ].apply(this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if (typeof method === 'object' || !method )
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			alert('Method ' +  method + ' does not exist on jquery.easybg');
		}
	}
	
})(jQuery);