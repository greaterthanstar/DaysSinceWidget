package com.dayssince

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.preference.PreferenceManager
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = if (isSystemInDarkTheme()) darkColorScheme() else lightColorScheme()
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ConfigurationScreen(onSave = {
                        val intent = Intent(this, DaysWidgetProvider::class.java)
                        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                        val ids = AppWidgetManager.getInstance(application)
                            .getAppWidgetIds(ComponentName(application, DaysWidgetProvider::class.java))
                        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                        sendBroadcast(intent)
                    })
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConfigurationScreen(context: Context = androidx.compose.ui.platform.LocalContext.current, onSave: () -> Unit) {
    val prefs = remember { PreferenceManager.getDefaultSharedPreferences(context) }
    
    var dateString by remember { mutableStateOf(prefs.getString("target_date", LocalDate.now().toString()) ?: LocalDate.now().toString()) }
    var mode by remember { mutableStateOf(prefs.getString("mode", "countdown") ?: "countdown") }
    var colorHex by remember { mutableStateOf(prefs.getString("font_color", "#FFFFFF") ?: "#FFFFFF") }
    var fontSize by remember { mutableStateOf(prefs.getInt("font_size", 64)) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Text(
            "Widget Settings",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )

        OutlinedTextField(
            value = dateString,
            onValueChange = { dateString = it },
            label = { Text("Target Date (YYYY-MM-DD)") },
            modifier = Modifier.fillMaxWidth()
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Button(
                onClick = { mode = "countdown" },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (mode == "countdown") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                    contentColor = if (mode == "countdown") MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                )
            ) { Text("Countdown") }

            Button(
                onClick = { mode = "countup" },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (mode == "countup") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                    contentColor = if (mode == "countup") MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                )
            ) { Text("Count Up") }
        }

        Text("Font Color: $colorHex", style = MaterialTheme.typography.bodySmall)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("#FFFFFF", "#FFFB00", "#00FF77", "#00E1FF", "#FF3366").forEach { hex ->
                Button(
                    onClick = { colorHex = hex },
                    modifier = Modifier.size(40.dp),
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(android.graphics.Color.parseColor(hex))),
                    content = {}
                )
            }
        }

        Slider(
            value = fontSize.toFloat(),
            onValueChange = { fontSize = it.toInt() },
            valueRange = 32f..120f
        )
        Text("Font Size: $fontSize sp", style = MaterialTheme.typography.bodySmall)

        Spacer(modifier = Modifier.weight(1f))

        Button(
            onClick = {
                prefs.edit().apply {
                    putString("target_date", dateString)
                    putString("mode", mode)
                    putString("font_color", colorHex)
                    putInt("font_size", fontSize)
                    apply()
                }
                onSave()
            },
            modifier = Modifier.fillMaxWidth().height(56.dp)
        ) {
            Text("Save Widget", style = MaterialTheme.typography.titleMedium)
        }
    }
}
